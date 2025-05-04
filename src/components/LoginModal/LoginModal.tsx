"use client"

import { signIn } from "next-auth/react"
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { LoginModalProps } from './LoginModal.types';
import Github from '@/icons/Github';

export default function LoginModal(props: LoginModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Entrar no Chat</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to QuickChat</DialogTitle>
          <DialogDescription>
            QuickChat makes it effortless to create secure chat links and start
            conversations in seconds.
          </DialogDescription>
        </DialogHeader>
        <Button variant="outline" onClick={() =>
          signIn('github', {
            redirect: true,
            callbackUrl: "/",
          })
        }>
          <Github />
          Continue with Github
        </Button>
      </DialogContent>
    </Dialog>
  )
}