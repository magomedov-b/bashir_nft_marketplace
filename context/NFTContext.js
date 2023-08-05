'use client'

import React, { useState, useEffect } from "react";
import Web3Modal from 'web3modal';
import { ethers } from "ethers";
import axios from 'axios';
import  {create as ipfsHttpClient} from 'ipfs-http-client';

import { MarketAddress, MarketAddressABI } from "./constants";
import {PROJECT_ID} from "@/SECRET_KEYS";
import {PROJECT_SECRET} from "@/SECRET_KEYS";


const auth = `Basic ${Buffer.from(`${PROJECT_ID}:${PROJECT_SECRET}`).toString('base64')}`;

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
const dedicatedEndPoint = 'bashir';


const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
      if(!window.ethereum) return alert('Please install MetaMask');

      const accounts = await window.ethereum.request({method: 'eth_accounts'});
      if (accounts.length) {
          setCurrentAccount(accounts[0]);
      } else {
          console.log('No accounts found');
      }
  };

  useEffect(() => {
      checkIfWalletIsConnected();
  }, []);

  const connectWallet = async() => {
      if(!window.ethereum) return alert('Please install MetaMask');
      const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      setCurrentAccount(accounts[0]);
      window.location.reload();
  }

    const uploadToIPFS = async (file) => {
        const subdomain = 'https://bashir.infura-ipfs.io';
        try {
            const added = await client.add({ content: file });
            const URL = `${subdomain}/ipfs/${added.path}`;
            return URL;
        } catch (error) {
            console.log('Error uploading file to IPFS.');
        }
    };
  const createNFT = async (formInput, fileUrl, router) => {
      const {name, description, price} = formInput;

      if (!name || !description || !price || !fileUrl) return;

      const data = JSON.stringify({name, description, image: fileUrl});

      try {
          // const added = await client.add(data);
          const added = await client.add({ content: data });
          const subdomain = 'https://bashir.infura-ipfs.io';

          const URL = `${subdomain}/ipfs/${added.path}`;

          await createSale(URL, price);

          router.push('/');
      } catch (e) {
          console.error(e);
      }
  };


  const createSale = async (url, formInputPrice, isReselling, id) => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const price = ethers.utils.parseUnits(formInputPrice, 'ether');
      const contract = fetchContract(signer);
      console.log(contract)
      const listingPrice = await contract.getListingPrice();

      const transaction = await contract.createToken(url, price, {value: listingPrice.toString()});

      await transaction.wait();
  }

  const fetchNFTs = async () => {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice}) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const { data: {image, name, description}} = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

          return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI
          }
      }));

      return items

  }

  const fetchMyNFTsOrListedNFTs = async (type) => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = fetchContract(signer);

      const data = type === 'fetchItemsListed'
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice}) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const { data: {image, name, description}} = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

          return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI
          }
      }));
      return items;
  }

  return (
      <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs }}>
          {children}
      </NFTContext.Provider>
  )
};
