import Image from "next/image";
import { useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
import Logo from "./images/strinx.png";
import { useState } from "react";
import openseaLogo from '../assets/opensea.png'
export default function SignIn() {
  const { authenticate, authError, isAuthenticating, Moralis } = useMoralis();

  const handleCustomLogin = async () => {
    await authenticate({
      provider: "web3Auth",
      clientId: "BA-YZ0DqF7y-Yz5nfkWJC0PPW4M5Aqs46flA0BB0a88NgEDBF1viISFe3ek4Zume-tm-CNhQkrVPS12n-i6fYlE",
      chainId: Moralis.Chains.POLYGON_MUMBAI,
      appLogo:"https://www.google.com/search?q=photo+logo&rlz=1C1CHBF_enIN973IN973&sxsrf=APq-WBuMgQxQwhAXhMp_mAuM-nKznP0IVw:1645123308956&tbm=isch&source=iu&ictx=1&vet=1&fir=51hIpG3SCyXICM%252CBfmehsVtJHh7aM%252C_%253BADOSP0vE8XMpuM%252CUX2c2Abqzg4EQM%252C_%253BsYyONMAuz3sx7M%252CdfZuYI1Q5ipx7M%252C_%253BoMQeldBeDi1hIM%252CAddw-5rOJmLMgM%252C_%253BW6VkaTPieuF3zM%252C8onTmluaZw4chM%252C_%253BObLZfG6gCcWGqM%252CVJuEC5sMu07x0M%252C_%253BA4ZwbJLSZYOFuM%252CE4OaIMdE6KGnRM%252C_%253BUyiqW9h5bjhOMM%252CNtYrNhcNAr0JUM%252C_%253BAztV8Lbl1SI0DM%252CgX3DuqM3QvaiBM%252C_%253BHVSfFS6Agt8vHM%252CPFXwzkRhMpy7ZM%252C_%253BNAlQ0DwwIaV4TM%252C_eXPqlWzePQeCM%252C_%253Bw6WeW9p-KMuuSM%252COgSBkvh9jwLN6M%252C_%253BaI4ePsKiuLYNpM%252CIdMjurZj3qNrqM%252C_%253BskuDons5W3UQpM%252CbIpyO5P1DfOBtM%252C_&usg=AI4_-kTVJEM2-QC-6MDu4GBujxDBgOt5PQ&sa=X&ved=2ahUKEwjcl8TzsYf2AhWRyzgGHa7hB2gQ9QF6BAgeEAE#imgrc=skuDons5W3UQpM",
    });
  };

  return (
    <div className={styles.card}>
      <Image className={styles.img} src={Logo} width={80} height={80} />
      {isAuthenticating && <p className={styles.green}>Authenticating</p>}
      {authError && (
        <p className={styles.error}>{JSON.stringify(authError.message)}</p>
      )}
      <div className={styles.buttonCard}>
        <button className={styles.loginButton} onClick={handleCustomLogin}>
          Login with StringX
        </button>
      </div>
    </div>
  );
}