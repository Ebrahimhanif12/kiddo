import Image from "next/image";
import{useState} from "react";

const ShimmerMessage = () => {
    const message = [
        "Thinking...",
        "Loading...",
        "Analyzing Your Request...",
        "Building your Website...",
        "Crafting components...",
        "Optimizing layout...",
        "Adding final touches...",
        "Almost Ready...",
    ]

    const [currentMessageIndex] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() =>{
    //         setCurrentMessageIndex((prev) => (prev+1) % message.length);
    //     },2000)
    // }, [message.length]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
                {message[currentMessageIndex]}
            </span>
        </div>
    )
}

export const MessageLoading = () => {
    return(
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image 
                src="/kiddoLogo2.png"
                alt="kiddo"
                width={18}
                height={18}
                className="shrink-0"
                />
                <span className="text-sm font-medium">Kiddo</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <ShimmerMessage/>
            </div>
        </div>
    )
}


