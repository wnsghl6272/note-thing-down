'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ThreadsCallback() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleCallback = async () => {
      if (session?.user?.id) {
        // 현재 URL에서 code 파라미터 추출
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (code) {
          // /api/auth/threads로 리다이렉트하여 토큰 저장
          window.location.href = `/api/auth/threads?code=${code}&user_id=${session.user.id}`;
        }
      }
    };

    handleCallback();
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
} 