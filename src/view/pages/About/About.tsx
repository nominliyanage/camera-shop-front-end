export function About() {
    return (
        <div className="flex justify-center px-4 py-10 shadow-lg shadow-blue-300">
            <div className="max-w-2xl w-full text-center">
                <h2 className="text-5xl font-bold text-black-500 underline decoration-4 mb-6">
                    About Us
                </h2>
                <p className="text-[1.6rem] text-gray-700 leading-relaxed">
                    At <span className="font-semibold text-red-600">Glamor Shot</span>, we are passionate about helping photographers and videographers bring their creative visions to life. Whether you're a seasoned professional or just starting out, we provide the tools you need to capture every moment with clarity and precision.
                    <br /><br />
                    <span className="font-semibold">Mission:</span> Our mission is to offer top-quality camera equipment, expert guidance, and exceptional service to empower creators at every level. We’re dedicated to building a community that values innovation, storytelling, and the art of visual expression.
                </p>
            </div>
        </div>
    );
}
