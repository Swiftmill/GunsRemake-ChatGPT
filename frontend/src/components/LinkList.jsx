import React from 'react';
import { FiExternalLink, FiHeadphones, FiGlobe, FiShoppingBag, FiYoutube, FiTwitter, FiMessageCircle, FiServer, FiInstagram } from 'react-icons/fi';

const iconMap = {
  music: <FiHeadphones />,
  globe: <FiGlobe />,
  cart: <FiShoppingBag />,
  youtube: <FiYoutube />,
  twitter: <FiTwitter />,
  discord: <FiMessageCircle />,
  status: <FiServer />,
  instagram: <FiInstagram />,
  soundcloud: <FiHeadphones />
};

const LinkList = ({ links = [], onClick }) => (
  <div className="space-y-3">
    {links.map((link) => (
      <a
        key={link.url}
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className="link-tile"
        onClick={() => onClick?.(link)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg bg-white/10 p-3 rounded-2xl">
            {iconMap[link.icon] || link.icon || <FiExternalLink />}
          </span>
          <div>
            <p className="font-semibold text-white">{link.title}</p>
            <p className="text-xs text-white/60">{link.url}</p>
          </div>
        </div>
        <FiExternalLink className="text-white/50" />
      </a>
    ))}
  </div>
);

export default LinkList;
