
interface LayoutProps {
    children: JSX.Element
};

// Shared app layout common to all pages
export default function AppLayout({ children }: LayoutProps) {
    return (
        <div className="app">
            {children}
        </div>
    );
}
