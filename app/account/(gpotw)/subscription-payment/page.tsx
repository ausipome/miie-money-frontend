import StripeSubscriptionCheckout from "@/components/gpotw/subscriptions/SecureSubscription";


export default function Page() {
    return( 
        <div className="min-w-[400px] mt-8">
        <StripeSubscriptionCheckout />
        </div>
        )
}