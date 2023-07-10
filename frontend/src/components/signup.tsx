import { Button, Label, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
  
    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };
  
    const handleInputChange = (e:any) => {
      setPassword(e.target.value);
    };    return (
        <section className='flex' id='section1'>
            <div className='basis-1/2 xl:pl-44 md:pl-20 mt-20 sm:pl-0' id='form'>
                <form className="flex max-w-md flex-col gap-4">
                    <div>
                        <span className='text-5xl'>Welcome to your professional community</span>
                    </div>
                    <div>
                        <div className="mb-2 block">
                        <Label
                            htmlFor="email1"
                            value="Your email"
                        />
                        </div>
                        <TextInput
                        id="email1"
                        placeholder="name@flowbite.com"
                        required
                        type="email"
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                        <Label
                            htmlFor="password1"
                            value="Your password"
                        />
                        </div>
                        <div className=''>
                            <TextInput
                            id="password1"
                            className='w-full'
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="remember" className='text-blue-600'>
                            <Link href=''>Forget password ?</Link>
                        </Label>
                    </div>
                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </div>
            <div className='basis-1/2 m-auto'>
                <img src='signup.svg' />
            </div>
        </section>
    )
}