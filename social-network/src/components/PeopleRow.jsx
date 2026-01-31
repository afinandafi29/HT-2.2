import ProfilePic from './ProfilePic';

function PeopleRow({ people = [] }) {
  return (
    <div className="people-row">
      {people.map((person, index) => (
        <ProfilePic
           key={index} // Use a more stable key if available (e.g., person.id)
           src={person.avatar_url}
           isPremium={person.premium}
           size="w-10 h-10 md:w-12 md:h-12" // Responsive size
           hoverEffect={true} // Enable hover for people row
        />
      ))}
    </div>
  );
}

export default PeopleRow;