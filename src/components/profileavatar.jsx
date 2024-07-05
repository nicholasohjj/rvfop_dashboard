import PropTypes from "prop-types";
import { Avatar } from "react95";

export const ProfileAvatar = ({ name, nameColor }) => {
  const generateColorFromName = () => {
    let hash = 0;

    for (let i = 0; i < nameColor.length; i++) {
      hash = nameColor.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 75%, 60%)`;
    return color;
  };

  return (
    <Avatar
      style={{
        background: generateColorFromName(),
        flexShrink: 0,
      }}
      size={40}
    >
      {name[0]}
    </Avatar>
  );
};

ProfileAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  nameColor: PropTypes.string.isRequired,
};
