
"use client"
import React, {useState} from 'react';
import BuyCreditButton from "@/components/buy-credit-button";
import {Modal} from "react-bootstrap";
export default function Page() {

      const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);

    const [method,setMethod] = useState([           {
        "name": "VISA",
        "type": "visa",
        "logo": "https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/visa.png",
        "gw": "visacard",
        "r_flag": "1",
        "redirectGatewayURL": "https://sandbox.sslcommerz.com/gwprocess/v4/bankgw/indexhtmlOTP.php?mamount=1000.00&ssl_id=2310191520231MLVg8ZTsa9Ld4k&Q=REDIRECT&SESSIONKEY=9CE83C4562A96645C7652AF10D220C37&tran_type=success&cardname=visavard"
    },]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const PaymentOption = async () => {
            setLoader(true)
            let res=await fetch("/api/payment/initiate",{method:'POST'});
            let JSON=await res.json();
            setLoader(false);
            setShow(true);
            setMethod(JSON['data']['desc'])
    }


    const PayNow = (PayURL) => {
        window.location.replace(PayURL);
    }


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <section className="max-w-3xl w-full bg-white rounded-xl shadow-md p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Pricing</h1>
          <p className="mt-2 text-gray-600">
            A simple plan for hobbyists and early users — 5 credits for 50 BDT.
            Use credits to run code assistants, experiments, and more.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 border rounded-lg">
            <h2 className="text-xl font-medium">One-time bundle</h2>
            <p className="mt-2 text-gray-600">Get 5 credits to spend on the platform.</p>

            <ul className="mt-4 space-y-2 text-gray-700">
              <li>• 5 credits (non-recurring)</li>
              <li>• Instant credit after successful payment</li>
              <li>• Use credits on agents, sandboxes, and premium features</li>
              <li>• Secure checkout via SSLCommerz</li>
            </ul>

            <div className="mt-6 text-sm text-gray-500">
              <strong>Note:</strong> You will be redirected to SSLCommerz to complete payment.
            </div>
          </div>

          <aside className="p-6 border rounded-lg flex flex-col items-center justify-between">
            <div>
              <div className="text-4xl font-bold">50 BDT</div>
              <div className="text-sm text-gray-600 mt-1">= 5 credits</div>
            </div>

            <div className="mt-6">
              <button className="font-black" onClick = {PaymentOption}> Buyyyyyy</button>
           {/* <BuyCreditButton onClick={PaymentOption} submit={loader} className="btn btn-primary" text="Checkout"/> */}

            </div>
          </aside>
        </div>

        <footer className="mt-8 text-xs text-gray-500">
          <div>Questions? Contact support or check your account usage after purchase.</div>
        </footer>
      </section>

      {/* <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <h6>Pay Now</h6>
                </Modal.Header>
                <Modal.Body className="bg-white">

                    <div className="container-fluid ">
                        <div className="row">

                            {
                                method.map((item,i)=>{
                                    return(
                                        <div className="col-md-2 col-lg-2 col-6 p-1">
                                            <div className="card  h-100 bg-white shadow-sm">
                                                <a onClick={()=>{PayNow(item['redirectGatewayURL'])}}>
                                                    <img className="w-100 pay-img" src={item['logo']}/>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })
                            }





                        </div>
                    </div>
                </Modal.Body>
            </Modal> */}
      
    </main>
  );
}