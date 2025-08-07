"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, memo } from "react";

interface HeaderProps {
  ethBalance?: string;
  walletAddress?: string;
}

const Header: React.FC<HeaderProps> = memo(
  ({ ethBalance = "0.0105", walletAddress = "0x73..4e49" }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ backgroundColor: "#100D20", borderBottomColor: "#2A2535" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  {/* Logo Image or Text Fallback */}
                  <div className="flex items-center space-x-1">
                    {!imageError ? (
                      <Image
                        src="/logo.png"
                        alt="ABATTLE Logo"
                        width={120}
                        height={32}
                        className="h-8 w-auto"
                        priority
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="text-2xl font-bold">
                        <span className="text-green-400">A</span>
                        <span className="text-blue-400">B</span>
                        <span className="text-indigo-600">A</span>
                        <span className="text-purple-500">T</span>
                        <span className="text-orange-500">T</span>
                        <span className="text-red-500">L</span>
                        <span className="text-yellow-400">E</span>
                      </div>
                    )}

                    {/* Scattered pixels around logo */}
                    <div className="relative ml-2">
                      <div className="absolute -top-1 -left-1 w-1 h-1 bg-pink-400 rounded-sm animate-pulse"></div>
                      <div className="absolute -top-1 -right-1 w-1 h-1 bg-cyan-400 rounded-sm animate-pulse delay-100"></div>
                      <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-400 rounded-sm animate-pulse delay-200"></div>
                      <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-green-400 rounded-sm animate-pulse delay-300"></div>
                      <div className="absolute top-1/2 -left-2 w-1 h-1 bg-purple-400 rounded-sm animate-pulse delay-150"></div>
                      <div className="absolute top-1/2 -right-2 w-1 h-1 bg-orange-400 rounded-sm animate-pulse delay-250"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-6">
                <Link
                  href="/leaderboard"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Leaderboard
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  FAQ
                </Link>
              </nav>
            </div>

            {/* Wallet Button */}
            <button className="flex items-center space-x-2 bg-gray-900/50 border border-orange-400/50 rounded-lg px-3 py-2 hover:bg-gray-800/70 transition-colors">
              {/* Wallet Icon */}
              <div className="w-4 h-4">
                <Image
                  src="/icons/WALLET.svg"
                  alt="Wallet"
                  width={16}
                  height={16}
                  className="w-full h-full"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(84%) sepia(100%) saturate(1000%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                  }}
                />
              </div>

              {/* ETH Icon */}
              <div className="w-4 h-4">
                <Image
                  src="/icons/ETH.svg"
                  alt="ETH"
                  width={16}
                  height={16}
                  className="w-full h-full"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(84%) sepia(100%) saturate(1000%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                  }}
                />
              </div>

              {/* Text */}
              <span className="text-green-400 font-medium text-sm">
                {ethBalance} ETH
              </span>
              <span className="text-white font-mono text-sm">
                {walletAddress}
              </span>
            </button>
          </div>
        </div>
      </header>
    );
  }
);

export default Header;
