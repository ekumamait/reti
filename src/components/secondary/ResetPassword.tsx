import { Button, Input } from "antd";


const ResetPasswordForm = () => {

    return (
        <>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">Email</label>
                        <div className="mt-2">
                            <Input
                                placeholder="Enter your email"
                                type="Email"
                                size="large"
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="primary" size="large" className="flex w-full justify-center px-3 py-4 text-sm/6 font-semibold text-white">Reset your password</Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Remembered your password? {''}
                    <a href="/login" className=" text-[#5B9BD5] hover:text-[#5B9BD5] hover:underline">Log in</a>
                </p>
            </div>
        </>
    )
}

export default ResetPasswordForm;