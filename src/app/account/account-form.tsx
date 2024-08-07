'use client'
import Avatar from './avatar'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Button from '@/components/ui/button'
import Image from 'next/image'
import Logo from '../../../public/assets/Logo.svg'
import { Switch } from "@/components/ui/switch"


interface AccountFormProps {
  user: User | null
}

export default function AccountForm({ user }: AccountFormProps): JSX.Element {
  const supabase = createClient()
  const [loading, setLoading] = useState<boolean>(true)
  const [name, setName] = useState<string | null>(null)
  const [about, setAbout] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('users')
        .select('name, about, avatar')
        .eq('user_id', user?.id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (!data) {
        throw new Error('Profile data not found')
      }

      setName(data.name ?? null)
      setAbout(data.about ?? null)
      setAvatar(data.avatar ?? null)
    } catch (error) {
      alert('Error fetching profile data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (user) {
      void getProfile()
    }
  }, [user, getProfile])

  const updateProfile = async ({
    name: newName,
    about: newAbout,
    avatar: newAvatar
  }: {
    name: string | null
    about: string | null
    avatar: string | null
  }): Promise<void> => {
    try {
      setLoading(true)

      const { error } = await supabase.from('users').upsert({
        user_id: user?.id,
        name: newName,
        about: newAbout,
        avatar: newAvatar
      })

      if (error) {
        throw new Error(error.message)
      }

      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClick = async (): Promise<void> => {
    await updateProfile({ name, about, avatar })
  }

  const handleSignOut = (): void => {
    const form = document.createElement('form')
    form.method = 'post'
    form.action = '/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <div className='h-screen'>
      <header className="flex flex-row items-center justify-start p-4 gap-2 w-full">
        <Image src={Logo} alt="StudyCrew Logo" className="w-[45px] h-[45px] fill-white" />
        <h1 className='relative fontFamily-rubik text-primary-500 text-[30px] font-bold'>StudyCrew
          <span className="absolute uppercase bg-[#D3E4FF] text-[8px] text-gray-900 rounded-md px-1 py-0.5 -right-5 bottom-0">beta</span>
        </h1>
        <h2 className='font-bold text-center text-[40px] w-full'>Create Your Profile</h2>
      </header>
      <div className='grid grid-cols-2 h-full px-[125px]'>
        <div>
          <h3 className='text-2xl font-bold'>Avatar</h3>
        </div>
        <div>
          <form className='flex flex-col gap-7'>
            <h3 className='text-2xl font-bold'>Account</h3>
            <div className='bg-gray-200 rounded-lg py-[25px] px-[35px] flex flex-col gap-3'>
              <div className='flex flex-col'>
                <label htmlFor="fullName">Username</label>
                <input
                  id="fullName"
                  type="text"
                  value={name ?? ''}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                  className="border border-grey rounded-lg px-2"
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="about">About</label>
                <textarea
                  id="about"
                  rows={4}
                  value={about ?? ''}
                  onChange={(e) => {
                    setAbout(e.target.value)
                  }}
                  className="border border-grey rounded-lg px-2"
                />
              </div>
            </div>
            <h3 className='text-2xl font-bold'>Settings</h3>
            <div className='bg-gray-200 rounded-lg py-[25px] px-[35px] flex flex-col gap-3'>
              <div className='flex justify-between items-center'>
                <p>Show Study Groups on Profile</p>
                <Switch />
              </div>
              <div className='flex justify-between items-center'>
                <p>Enable Email Notifications</p>
                <Switch />
              </div>
            </div>
            <Button
              className="uppercase rounded-lg py-0.5 px-2 w-full"
              onClick={handleUpdateClick}
              disabled={loading}
              text={loading ? 'Loading ...' : 'Join StudyCrew'}
            />
          </form>
        </div>
      </div>
      <div className='bg-primary-100'>
        <p className='text-center text-xs'>The avatar style {" "}
          <a
            href="https://www.dicebear.com/styles/big-ears/"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            "Big Ears"
          </a> from {" "}
          <a
            href="https://www.dicebear.com/"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            DiceBear
          </a> is a remix of {" "}
          <a
            href="https://www.figma.com/community/file/986078800058673824"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            "Face Generator"
          </a> by {" "}
          <a
            href="https://www.figma.com/exit?url=https%3A%2F%2Fthevisual.team%2F"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
            >
              The Visual Team
          </a>, licensed under {" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className="underline hover:text-primary-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY 4.0.
          </a>
        </p>
      </div>
    </div>
  )
}
