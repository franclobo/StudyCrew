"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { PiPencilSimple } from "react-icons/pi";
import { usePathname, redirect } from 'next/navigation';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface PageProps {
  params: { profileId: string }
}

export default function ProfileDetailPage({ params }: PageProps): JSX.Element {
  const [avatar, setAvatar] = useState<string>('');
  const [name, setName] = useState<string>();
  const [about, setAbout] = useState<string>();
  const [showGroups, setShowGroups] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const supabase = createClient();
  const pathname = usePathname();

  const editAvatar = () => {
    const redirectUrl = `${pathname}/account`;
    redirect(redirectUrl);
  };

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', params.profileId)
      .single();

    if (error) {
      console.error('error', error);
      return;
    }
    setAvatar(data?.avatar ?? '');
    setName(data?.name ?? '');
    setAbout(data?.about ?? '');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex items-center gap-x-6 pl-[132px] pr-[204px]">
      <section>
        <h2 className="text-2xl font-bold">Profile</h2>
        <div className="flex flex-col items-center justify-between p-6 w-[328px] h-[594px] mt-4 bg-[#fcfcfd] rounded-xl">
          <div className="relative flex justify-center w-fit">
            <Image
              src={avatar}
              width={150}
              height={150}
              alt="User Avatar"
              className="rounded-full"
            />
            <div className="absolute bottom-0 right-0">
              <button
                onClick={editAvatar}
                className="bg-primary-500 p-2.5 rounded-lg"
              >
                <PiPencilSimple className="text-white" />
              </button>
            </div>
          </div>
          <div className="text-center pt-6">
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm">{name}</p>
          </div>
          <article className="pt-9">
            <p>{about}</p>
          </article>
          <div className="mt-[152px]">
            <Button className="mt-4 uppercase text-[16px] leading-[20.83px] font-bold font-dmSans" text="Edit Profile" />
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="flex flex-col items-start p-6 w-[680px] h-[594px] mt-4 bg-[#fcfcfd] rounded-xl gap-y-4">
          <div>
            <h2 className="text-[22px] font-medium leading-[26.07px]">Account</h2>
            <form className="flex flex-col gap-y-[27px]">
              <div className="flex flex-col items-start gap-[11px] mt-3">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" className="bg-transparent" placeholder='shawnkhan@email.com' />
              </div>
              <div className="flex flex-col items-start gap-[11px]">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="bg-transparent" placeholder="*********" />
              </div>
              <Button className="mt-4 uppercase w-[90px] h-[36px] text-[12px] leading-[15.62px] font-bold font-dmSans" text="Edit Login" />
            </form>
          </div>
          <div>
            <h2 className="text-[22px] font-medium leading-[26.07px]">Privacy</h2>
            <div className="flex flex-col gap-y-4 mt-3">
              <div className="flex justify-between items-center w-[382px]">
                <p className='font-dmSans text-[18px] leading-[23.44px]'>Show Study Groups on Profile</p>
                <Switch
                  checked={showGroups}
                  onCheckedChange={(checked) => setShowGroups(checked)}
                />
              </div>
              <div className="flex justify-between items-center w-[382px]">
                <p className='font-dmSans text-[18px] leading-[23.44px]'>Show Statistics on Profile</p>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) => setEmailNotifications(checked)}
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-[22px] font-medium leading-[26.07px]">Notifications</h2>
            <div className="flex justify-between items-center w-[382px] mt-3">
              <p className='font-dmSans text-[18px] leading-[23.44px]'>Enable Email</p>
              <Switch
                checked={emailNotifications}
                onCheckedChange={(checked) => setEmailNotifications(checked)}
              />
            </div>
          </div>
          <div className='flex gap-x-7 mt-9'>
            <Button className="uppercase text-[12px] leading-[15.62px] font-bold font-dmSans bg-gray-200 border border-solid border-gray-600 text-gray-600" text="Log Out" />
            <Button className="uppercase text-[12px] leading-[15.62px] font-bold font-dmSans bg-error-600" text="Delete Your Account" />
          </div>
        </div>
      </section>
    </div>
  );
}