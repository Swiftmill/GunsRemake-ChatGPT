import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { sampleProfiles } from '../data/sampleProfiles';
import ProfileHeader from '../components/ProfileHeader';
import LinkList from '../components/LinkList';
import MusicPlayer from '../components/MusicPlayer';
import GalleryGrid from '../components/GalleryGrid';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/profiles/public/${username}`);
        if (mounted) {
          setProfile({
            ...data,
            badges: data.badges?.map((badge) => ({
              name: badge.name,
              color: badge.color,
              icon: '💠'
            })) || []
          });
        }
      } catch (err) {
        console.warn(err);
        const fallback = sampleProfiles.find((item) => item.username === username);
        if (fallback) {
          setProfile(fallback);
        } else {
          setError('Profile not found');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [username]);

  const handleLinkClick = async (link) => {
    try {
      await api.post(`/profiles/public/${username}/links/${link.id || link.title}/click`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center text-white/60">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-white/60">{error}</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-10">
      <ProfileHeader profile={profile} />
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <LinkList links={profile.links} onClick={handleLinkClick} />
          <MusicPlayer trackUrl={profile.musicUrl} autoPlay={profile.musicAutoplay} />
        </div>
        <GalleryGrid images={profile.gallery} />
      </div>
    </div>
  );
};

export default ProfilePage;
