export function Services() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Our Services</h1>
            <p className="text-lg text-gray-700 mb-2">
                At Keels Super, we offer a wide range of services to enhance your shopping experience.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-2">
                <li>Home Delivery</li>
                <li>Online Shopping</li>
                <li>Loyalty Programs</li>
                <li>Customer Support</li>
            </ul>
            <p className="text-lg text-gray-700">
                We are dedicated to providing you with the best service possible.
            </p>
        </div>
    );
}