import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

enum Status {
    verifying,
    failed,
    success
}

export default function verifyPage() {
    const router = useRouter();
    const token = router.asPath.split("#")[1];
    const [status, setStatus] = useState(Status.verifying);
    useEffect(() => {
        fetch(`${process.env.API_ROOT}/auth/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token}),
        }).then(res => {
            switch (res.status) {
                case 200:
                    setStatus(Status.success)
                    return;
                default: 
                    setStatus(Status.failed)
            }
        })
    }, [token])
    switch (status) {
        case Status.verifying:
            return <p>トークンを検証中です</p>
        case Status.failed:
            return <p>検証に失敗しました。トークンが無効です</p>
        case Status.success:
            return <p>検証に成功しました。<Link href="/login">ログインページ</Link>でログインしてください</p>
    }
}