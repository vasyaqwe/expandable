import {
   type CSSProperties,
   type ComponentProps,
   forwardRef,
   useEffect,
   useId,
   useRef,
   useState,
} from "react"
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs))

function Expandable({
   className,
   lineHeight = 1.5,
   numberOfLines,
   ...props
}: ComponentProps<"div"> & {
   lineHeight?: number
   numberOfLines: number
}) {
   const contentRef = useRef<HTMLDivElement>(null)
   const [isExpandable, setIsExpandable] = useState(false)

   useEffect(() => {
      const content = contentRef.current
      if (content) {
         const calculatedHeight = lineHeight * numberOfLines * 16 // Assuming 1em = 16px
         setIsExpandable(content.scrollHeight > calculatedHeight)
      }
   }, [lineHeight, numberOfLines])

   return (
      <div
         ref={contentRef}
         style={
            {
               "--line-height": `${lineHeight}`,
               "--number-of-lines": `${numberOfLines}`,
               ...props.style,
            } as CSSProperties
         }
         className={cn(
            isExpandable
               ? "[--expandable-content-height:calc(var(--line-height)*var(--number-of-lines)*1em)] has-[:checked]:[--expandable-content-height:initial]"
               : "[--expandable-content-height:initial]",
            className,
         )}
         {...props}
      >
         {props.children}
         {isExpandable && <ExpandableButton />}
      </div>
   )
}

const ExpandableContent = forwardRef<HTMLDivElement, ComponentProps<"p">>(
   ({ className, ...props }, ref) => (
      <p
         ref={ref}
         className={cn(
            "h-[var(--expandable-content-height)] overflow-hidden",
            className,
         )}
         {...props}
      />
   ),
)

const ExpandableButton = forwardRef<HTMLLabelElement, ComponentProps<"label">>(
   ({ className, children, ...props }, ref) => {
      const id = useId()

      return (
         <label
            htmlFor={props.htmlFor ? props.htmlFor : `expandable-content-${id}`}
            className={cn(
               "group mt-1 inline-block cursor-pointer text-brand hover:underline",
               className,
            )}
            data-no-dnd
            ref={ref}
            {...props}
         >
            <input
               id={props.htmlFor ? props.htmlFor : `expandable-content-${id}`}
               type="checkbox"
               className="peer sr-only"
            />
            {children}
            <span
               data-show-more
               className="peer-checked:hidden"
            >
               Show more
            </span>
            <span
               data-show-less
               className="hidden peer-checked:inline"
            >
               Show less
            </span>
         </label>
      )
   },
)

export { Expandable, ExpandableButton, ExpandableContent }
