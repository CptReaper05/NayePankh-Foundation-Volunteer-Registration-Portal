import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useModal } from '../context/ModalContext';

export default function LoginPage() {
  const router = useRouter();
  const { openLogin } = useModal();

  useEffect(() => {
    router.replace('/').then(() => {
      openLogin();
    });
  }, []);

  return null;
}