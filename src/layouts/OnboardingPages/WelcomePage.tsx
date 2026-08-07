import { useGetWelcomeImagesQuery } from "../../services/welcomeImages";

const WelcomePage = () => {
    const { data } = useGetWelcomeImagesQuery();
    const images = data?.data || [];

    return (
        <div
        className="space-y-2"
        >
            <div className="mt-2">
                <div className="text-xl/8 font-bold text-gray-900 sm:text-1xl/9">
                    <p>Welcome</p>
                </div>
                <div className="text-base/7 text-gray-700">
                    <p> Let's Build Your Profile!</p>
                </div>
            </div>
            <div className="py-8 flex justify-center gap-4 flex-wrap">
                {images.length > 0 ? (
                    images.map((image) => (
                        <img
                            key={image.id}
                            src={image.imageUrl}
                            alt="Welcome illustration"
                            className="w-full max-w-xs"
                        />
                    ))
                ) : (
                    <img
                        src="/images/undraw_solution_mindset_re_57bf.svg"
                        alt="Welcome illustration"
                        className="w-full max-w-xs"
                    />
                )}
            </div>
        </div>
    );
};

export default WelcomePage;
