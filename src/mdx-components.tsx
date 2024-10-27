import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: (props) => <h1 id={props.children?.toString().toLowerCase().split(" ").join("_")} className="mt-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl" {...props} />,
        h2: (props) => <h2 id={props.children?.toString().toLowerCase().split(" ").join("_")} className="mt-8 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" {...props} />,
        h3: (props) => <h3 id={props.children?.toString().toLowerCase().split(" ").join("_")} className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight" {...props} />,
        h4: (props) => <h4 id={props.children?.toString().toLowerCase().split(" ").join("_")} className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight" {...props} />,
        h5: (props) => <h5 id={props.children?.toString().toLowerCase().split(" ").join("_")} className="mt-8 leading-7 [&:not(:first-child)]:mt-6 font-bold" {...props} />,
        h6: (props) => <h6 id={props.children?.toString().toLowerCase().split(" ").join("_")} className="mt-8 leading-7 [&:not(:first-child)]:mt-6 font-bold" {...props} />,
        p: (props) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
        a: (props) => <a className="leading-7 [&:not(:first-child)]:mt-6 underline" {...props} />,
        ul: (props) => <ul className="ml-4 [&>li]:mt-2 list-disc" {...props} />,
        ol: (props) => <ol className="ml-4 [&>li]:mt-2 list-decimal" {...props} />,
        li: (props) => <li className='pl-2' {...props} />,
        blockquote: (props) => <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />,
        table: (props) => <table className="w-full" {...props} />,
        tr: (props) => <tr className="m-0 border-t p-0 even:bg-muted" {...props} />,
        th: (props) => <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />,
        td: (props) => <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />,
        img: (props) => <img className='m-auto w-full h-auto object-cover rounded-lg shadow-sm max-w-[500px] mb-8' {...props} />,
        ...components,
    }
}