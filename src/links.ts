const URL_PATTERN = /https?:\/\/[^\s<>()]+[^\s<>().,;:!?]/gi;

const KNOWN_HOSTS: Record<string, string> = {
  'open.spotify.com': 'Spotify',
  'spotify.com': 'Spotify',
  'youtube.com': 'YouTube',
  'youtu.be': 'YouTube',
  'soundcloud.com': 'SoundCloud',
  'bandcamp.com': 'Bandcamp',
  'ra.co': 'Resident Advisor',
  'instagram.com': 'Instagram',
  'facebook.com': 'Facebook',
  'mixcloud.com': 'Mixcloud',
};

export type DetectedLink = { url: string; label: string };

const labelFor = (url: string): string => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return KNOWN_HOSTS[host] ?? host;
  } catch {
    return url;
  }
};

/** Pulls every URL out of free text so descriptions stay plain to type but clickable to use. */
export const detectLinks = (text: string): DetectedLink[] => {
  const seen = new Set<string>();
  return (text.match(URL_PATTERN) ?? []).flatMap((url) => {
    if (seen.has(url)) return [];
    seen.add(url);
    return [{ url, label: labelFor(url) }];
  });
};
