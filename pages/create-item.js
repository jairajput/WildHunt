import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID; // Add your Infura Project ID
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET; // Add your Infura Project Secret

const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

import {
  marketplaceAddress
} from '../config';

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json';

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) {
      console.error('All fields are required, including the file.');
      return;
    }

    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
    }
  }

  async function listNFTForSale() {
    setLoading(true);
    try {
      const url = await uploadToIPFS();
      if (!url) {
        console.error('Failed to upload metadata to IPFS');
        setLoading(false);
        return;
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const price = ethers.utils.parseUnits(formInput.price, 'ether');
      const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer);

      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      const transaction = await contract.createToken(url, price, { value: listingPrice });
      await transaction.wait();

      router.push('/');
    } catch (error) {
      console.error('Error creating token or listing NFT:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} alt="Asset" />}
        <button
          onClick={listNFTForSale}
          className={`font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create NFT'}
        </button>
      </div>
    </div>
  );
}