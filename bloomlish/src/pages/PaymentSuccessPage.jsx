import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {

    const navigate = useNavigate();

    useEffect(() => {

        
        const timer = setTimeout(() => {
            navigate("/profile");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">

            <h1 className="text-4xl font-bold text-green-600 mb-4">
                Ödeme Başarılı! 🎉
            </h1>

            <p className="text-gray-700 text-lg mb-6">
                Ders kaydınız başarıyla tamamlandı.
            </p>

            <p className="text-gray-500 mt-4">
                Profil sayfasına yönlendiriliyorsunuz...
            </p>

        </div>
    );
}
