"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { Banner, CreatorCard, NFTCard } from "@/components";
import images from "@/assets"
import { makeId } from "@/utils/makeId";
import Image from "next/image";
import { useTheme } from "next-themes";
import { getCreators } from "@/utils/getTopCreators";

import { NFTContext } from '@/context/NFTContext';
import dynamic from "next/dynamic";
import {shortenAddress} from "@/utils/shortenAddress";

const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([])
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchNFTs()
    .then((items) => {
      setNfts(items);
      console.log(items);
    });
  }, []);

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);
    return () => {
      window.removeEventListener('resize', isScrollable);
    }
  });

  const topCreators = getCreators(nfts);
  topCreators.reverse();

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name="Discover, collect, and sell extraordinary NFTs"
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />
        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            Best Creators
          </h1>

          <div
            className="relative flex-1 max-w-full flex mt-3"
            ref={parentRef}
          >
            <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
              {topCreators.map((creator,i) => (
                <CreatorCard
                  key={creator.seller}
                  rank={i + 1}
                  creatorImage={images[`creator${i + 1}`]}
                  creatorName={shortenAddress(creator.seller)}
                  creatorEths={creator.sum}
                />
              ))}
              {/*{[6, 7, 8, 9, 10].map((i) => (*/}
              {/*    <CreatorCard*/}
              {/*        key={`creator-${i}`}*/}
              {/*        rank={i}*/}
              {/*        creatorImage={images[`creator${i}`]}*/}
              {/*        creatorName={`0x${makeId(3)}...${makeId(4)}`}*/}
              {/*        creatorEths={10 - i * 0.5}*/}
              {/*    />*/}
              {/*))}*/}
              {!hideButtons && (
                <>
                  <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0">
                    <Image src={images.left} fill style={{ objectFit: 'contain' }} alt="left_arrow" className={theme === 'light' && 'filter invert'} />
                  </div>
                  <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0">
                    <Image src={images.right} fill style={{ objectFit: 'contain' }} alt="left_arrow" className={theme === 'light' && 'filter invert'} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className=" flex-1font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 ">Hot Bids</h1>
            <div>SearchBar</div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft}/>)}
            {/*{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (*/}
            {/*  <NFTCard*/}
            {/*    key={`nft-${i}`}*/}
            {/*    nft={{*/}
            {/*      i,*/}
            {/*      name: `Nifty NFT ${i}`,*/}
            {/*      price: (10 - i * 0.534).toFixed(2),*/}
            {/*      seller: `0x${makeId(3)}...${makeId(4)}`,*/}
            {/*      owner: `0x${makeId(3)}...${makeId(4)}`,*/}
            {/*      description: 'Cool NFT on Sale'*/}
            {/*    }}*/}
            {/*  />*/}
            {/*))}*/}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
