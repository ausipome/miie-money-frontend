export default function Page() {
    return (
        <>
        {/* Header Section */}
        <section className="text-center bg-gradient-to-r from-blue-950 to-blue-600 text-white py-8 mt-6 h-full">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-pink-200">Subscriptions Coming Soon!</h1>
        <div className="md:w-2/3 sm:w-full m-auto">
            <p className="text-lg md:text-xl font-light mb-6">
            We’re thrilled to introduce our upcoming subscription features that will revolutionize how you manage and customize your services. Soon, you’ll have the power to issue and manage subscriptions directly from your dashboard.
            </p>
            <p className="text-lg md:text-xl font-light mb-6">
            Whether you want to build a seamless subscription experience for your website or implement custom components, our tools are designed to give you unmatched flexibility and control.
            </p>
            <ol className="text-lg md:text-xl font-light mb-6 list-decimal list-inside text-left mx-auto max-w-md">
            <li>Create tailored subscription plans for your customers</li>
            <li>Embed custom subscription components into your site</li>
            <li>Manage subscriptions effortlessly through your dashboard</li>
            </ol>
            <p className="text-lg md:text-xl font-light mb-6">
            These features are designed to empower you to offer value to your customers with minimal effort and maximum impact.
            </p>
        </div>
        </section>
        </>
    );
}



