import Login from '../../../components/user/Login';

export default function Page() {
    return (
        <>
                <div className="bg-blue-500 text-white p-4 rounded-md shadow-md my-2 w-3/4 mx-auto text-center">
                    <p className="text-xl text-white">You have been logged out!</p>
                </div>
                <Login />
        </>
        
    );
}