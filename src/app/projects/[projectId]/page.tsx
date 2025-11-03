interface Props {
    params: Promise<{ projectId: string }>;

}

const Page = async ({ params }: Props) => {
    const { projectId } = await params;

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
                <h1 className="text-2xl font-bold">Project ID: {projectId}</h1>
            </div>
        </div>
    );

}
export default Page;