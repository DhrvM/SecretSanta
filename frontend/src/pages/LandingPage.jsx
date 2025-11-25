import { motion } from 'framer-motion'
import { Background } from '../components/Background'
import { Footer } from '../components/Footer'
import { PartyForm } from '../components/PartyForm'

export default function LandingPage() {
  return (
    <motion.main 
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.4 }}
      className="p-4 h-[100dvh] w-full md:p-6"
    >
      <div className="relative h-full w-full">
        <Background />
        <PartyForm />
        <Footer />
      </div>
    </motion.main>
  )
}
