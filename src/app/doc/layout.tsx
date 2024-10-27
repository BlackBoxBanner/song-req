const MdLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <section className="bg-background flex justify-center">
            <article className="w-full max-w-[800px] p-4">
                {children}
            </article>
        </section>
    )
}

export default MdLayout