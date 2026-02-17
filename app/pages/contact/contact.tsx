"use client";
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import MoveUp from '../../components/MoveUp';
import Object from "@/app/components/Object.jsx";
import { extendVariants, Input, Button } from "@nextui-org/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";

const MyInput = extendVariants(Input, {
    variants: {
        color: {
            default: {
                inputWrapper: [
                    "border-foreground/50",
                    "text-foreground"
                ],
            },

        },

    },
    defaultVariants: {
        color: "default",
    },
});

export default function Contact() {
    const [email, setEmail] = useState('');
    const [idea, setIdea] = useState('');
    const [name, setName] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleEmailChange = (value: string) => {
        setEmail(value);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);

        setIsValidEmail(isValid);
    };

    const handleIdeaChange = (value: string) => {
        setIdea(value);
    };
    const handleNameChange = (name: string) => {
        setName(name);
    };

    const form = useRef<HTMLFormElement>(null);


    function sendEmail(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();


        if (form.current) {
            emailjs.send("service_73bx1vo", "template_ofpzphh", {
                from_name: name,
                message: idea,
                from_mail: email,
            }, {
                publicKey: 'QezxDBoP7eT1OHqgu'

            }
            )
                .then(() => {
                    onOpen();
                }, (error) => {
                    alert(`Please check your data is correct! (${error.message})`);
                });

        }
    };
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
            <div className="flex w-full max-w-4xl flex-col items-start justify-between px-6 py-20 sm:px-10">
                <MoveUp delay={0.5} text="Ready to innovate? Contact me 📫" className="pb-3 text-left font-monosans font-medium text-xl text-foreground subpixel-antialiased w-full sm:text-4xl" ></MoveUp>
                <MoveUp delay={0.7} text="I am open to creative and cooperative work. " className="text-left font-monosans font-medium text-lg text-foreground/70 subpixel-antialiased sm:text-2xl" ></MoveUp>
                <form onSubmit={sendEmail} ref={form} className='dark w-full'>
                    <Object dl={1.5} cl="w-full">
                        <MyInput type="text" name="user_name" onValueChange={handleNameChange} value={name} className="w-full pt-5 sm:w-8/12 sm:pt-8" variant="bordered" size="lg" label="Name"></MyInput>
                    </Object>
                    <Object dl={1.5} cl="w-full">
                        <MyInput type="email" name="user_email" onValueChange={handleEmailChange} value={email} isInvalid={isValidEmail ? false : true} errorMessage={isValidEmail ? "" : "Please enter a valid email"} className="w-full pt-5 sm:w-8/12 sm:pt-8 " variant="bordered" size="lg" label="Email"></MyInput>
                    </Object>
                    <Object dl={1.7} cl="w-full">
                        <MyInput name="message" onValueChange={handleIdeaChange} value={idea} className="w-full pt-4 sm:w-10/12 sm:pt-8" variant="bordered" size="lg" label="Your Idea"></MyInput>
                    </Object>
                    <Object dl={2}>
                        <Button type="submit" isDisabled={!isValidEmail || email == '' || name == '' || idea == ''} value="Send" color="primary" className="mt-4 sm:mt-8" size="lg">Send your Idea</Button>
                    </Object>
                    <Modal classNames={{
                        body: "py-5",
                        backdrop: "bg-foreground/50 backdrop-opacity-100",
                        base: "border-[#292f46] bg-foreground/100 dark:bg-foreground/40 text-background/100",
                        header: "border-b-[1px] border-background/20",
                        footer: "border-t-[1px] border-background/20",
                        closeButton: "hover:bg-white/10 active:bg-white/20",
                    }} isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Request received ✅</ModalHeader>
                                    <ModalBody>
                                        <h2>Your request has been received and I will be in touch with you soon.</h2>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onPress={onClose}>
                                            Got It!
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </form>
                <div className="flex w-full flex-col items-start justify-start pt-6 sm:flex-row sm:items-center">
                    <MoveUp delay={2} text="Or email me at" className="pr-2 min-w-32 text-left font-monosans font-medium text-md text-foreground/70 subpixel-antialiased sm:text-lg"></MoveUp>
                    <Object dl={2}>
                        <a className="break-all text-left font-monosans font-medium text-md text-foreground/50 subpixel-antialiased hover:text-foreground/90 duration-250 sm:text-lg" href="mailto:ignaciodoria01@gmail.com">ignaciodoria01@gmail.com</a>
                    </Object>
                </div>
                <MoveUp delay={2.7} text="All rights reserved © Ignacio Doria Oberman 2024" className="pt-4 text-left font-monosans font-medium text-sm text-foreground/70 subpixel-antialiased sm:text-lg" ></MoveUp>
            </div>
        </div>
    );
}
