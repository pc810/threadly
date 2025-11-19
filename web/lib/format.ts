export const getTwoCharacter = (str: string) => {
  const splits = str.split(" ");

  if (splits.length == 0) return str.slice(0, 2).toUpperCase();

  return splits
    .map((s) => s.at(0))
    .join()
    .toUpperCase();
};

export const getCommunityLink = (name: string) => {
  return `/r/${name}`;
};

export const getCommunityPostCreateLink = (name: string) => {
  return `/r/${name}/submit`;
};

export const formatCommunityName = (name: string) => {
  return `r/${name}`;
};
