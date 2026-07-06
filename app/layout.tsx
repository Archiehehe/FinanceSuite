import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/sidebar'
import TickerTape from '@/components/ticker-tape'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Archie's FinanceSuite",
  description: 'A unified suite of financial analysis tools by Archie',
  icons: {
    icon: "https://avatars.githubusercontent.com/u/193579350?v=4",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <TickerTape portfolio="AAPL,ABBV,AMAT,AMD,AMZN,ANET,APO,ARES,ARM,ASML,AVGO,AXP,BABA,BAM,BX,CAT,CDNS,CNC,COHR,CRWD,CRWV,DDOG,ELV,ENTG,FSLR,GLW,GOOGL,HON,ISRG,JPM,KKR,LITE,LLY,LRCX,META,MOH,MPWR,MRK,MRVL,MSFT,MU,NBIS,NOW,NVDA,NVO,ORCL,PANW,QCOM,QQQ,REGN,SLV,SNDK,SNOW,SNPS,SOXX,SPCX,STX,TEAM,TMO,TSEM,TSLA,TSM,TXN,UNH,V,VOO,VRTX,VST,WM,ZS" />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
