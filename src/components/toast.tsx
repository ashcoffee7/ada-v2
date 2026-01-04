import { Toaster } from "sonner";

export default function ToastLayout( {
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <html>
                <body>
                    {children}
                    <Toaster closeButton position = "bottom-right"/>
                </body>
            </html>
        </>
    );
}