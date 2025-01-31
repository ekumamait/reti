
import { Button, Layout } from 'antd';
import viteLogo from '/images/undraw_business_chat_re_gg4h.svg'


const SuccessOnboardPage = () => {
    return (
        <Layout className="h-screen">
            <div className="my-auto sm:mx-auto sm:w-full sm:max-w-md sm:bg-white sm:border sm:rounded-[12px] px-4 py-4" >
                <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-32 w-auto" src={viteLogo} alt="Your Company" />
                        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Your account has been successufully created</h2>

                        <p className="mt-2 text-sm text-center text-gray-900">Now you can start exploring!</p>
                    </div>
                    <div className='mt-8'>
                        <Button type="primary" className="flex w-full justify-center px-3 py-4 text-sm/6 font-semibold text-white">Go to dashboard</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SuccessOnboardPage;
