import re

existing_file = "/Users/afi/Downloads/Happytalk JAN 10/social-network-/social-network-react/src/data.js"

with open(existing_file, "r") as f:
    content = f.read()

# Extract existing profileImages
match = re.search(r'export const profileImages = \[(.*?)\];', content, re.DOTALL)
if not match:
    print("Could not find profileImages in data.js")
    exit(1)

existing_images_str = match.group(1)
existing_images = [img.strip().strip('"').strip("'") for img in existing_images_str.split(",") if img.strip()]

new_images = [
    # Snippet 2 & 3
    "https://thumbs.dreamstime.com/b/portrait-young-happy-indian-business-man-executive-looking-camera-portrait-young-happy-indian-business-man-executive-214230764.jpg",
    "https://media.istockphoto.com/id/1501770003/photo/happy-handsome-young-indian-man-head-shot-front-portrait.jpg?s=612x612&w=0&k=20&c=P2toTbaknymA7vf28IQNa-3xrlUjPXLFqvN2Zra8_nw=",
    "https://media.gettyimages.com/id/1540766473/photo/young-adult-male-design-professional-smiles-for-camera.jpg?s=612x612&w=gi&k=20&c=S-S_NmeW9WxeUh07b0ctnHlLRU7flXQakdLrcNC92E8=",
    "https://media.istockphoto.com/id/1987655119/photo/smiling-young-businesswoman-standing-in-the-corridor-of-an-office.jpg?s=612x612&w=0&k=20&c=5N_IVGYsXoyj-H9vEiZUCLqbmmineaemQsKt2NTXGms=",
    "https://thumbs.dreamstime.com/b/profile-picture-smiling-indian-young-businesswoman-look-camera-posing-workplace-headshot-portrait-happy-millennial-ethnic-190959731.jpg",
    "https://img.freepik.com/free-photo/closeup-smiling-young-beautiful-indian-woman_1262-2261.jpg?semt=ais_hybrid&w=740&q=80",
    "https://thumbs.dreamstime.com/b/smiling-professional-business-leaders-employees-group-team-portrait-coaches-mentors-posing-together-diverse-office-141681202.jpg",
    "https://thumbs.dreamstime.com/b/happy-diverse-business-team-standing-office-looking-camera-professional-stand-smiling-young-old-multiracial-workers-152638071.jpg",
    "https://thumbs.dreamstime.com/b/smiling-young-indian-man-looking-camera-close-up-portrait-natural-light-outdoor-casual-cheerful-face-happy-336413077.jpg",
    "https://thumbs.dreamstime.com/b/close-up-laughing-indian-woman-smiling-widely-sitting-sofa-look-away-radiating-joy-positivity-having-attractive-appearance-364412250.jpg",
    "https://www.shutterstock.com/image-photo/smiling-indian-man-beard-dressed-260nw-2650944205.jpg",
    "https://thumbs.dreamstime.com/b/headshot-close-portrait-indian-latin-260nw-2303502253.jpg",
    "https://media.istockphoto.com/id/499907722/photo/portrait-of-a-beautifull-smiling-man.jpg?s=612x612&w=0&k=20&c=hY8vXBfdJPJcZwhnEi-I59PAofMeBnRlpldsK2ozSNw=",
    "https://media.istockphoto.com/id/474671503/photo/handsome-young-indian-man-smiling.jpg?s=612x612&w=0&k=20&c=p3hObE-NWq0s9KtUm0ZrIeT77axpnfMyUbzUBlQj2ig=",
    "https://thumbs.dreamstime.com/b/close-up-portrait-happy-young-man-smiling-against-gray-background-36889692.jpg",
    "https://thumbs.dreamstime.com/b/happy-successful-handsome-young-indian-man-casual-indoor-portrait-positive-confident-professional-business-man-entrepreneur-280747774.jpg",
    "https://thumbs.dreamstime.com/b/serious-handsome-young-indian-professional-man-looking-camera-formal-suit-confident-stylish-businessman-executive-legal-315449484.jpg",
    "https://thumbs.dreamstime.com/b/happy-indian-business-leader-man-posing-professional-portrait-handsome-young-office-space-looking-camera-smiling-413371059.jpg",
    "https://www.shutterstock.com/image-photo/portrait-young-indian-man-wearing-260nw-2485340449.jpg",
    "https://thumbs.dreamstime.com/b/years-old-man-portrait-144395840.jpg",
    "https://media.gettyimages.com/id/985138636/photo/portrait-of-confident-woman-smiling-on-white.jpg?s=612x612&w=gi&k=20&c=QeadcT1rbeHaR1O65n8A8PKfOxtiVz7-ox76mNLP8jg=",
    "https://thumbs.dreamstime.com/b/closeup-portrait-beautiful-young-smiling-indian-woman-pretty-smile-95393005.jpg",
    "https://thumbs.dreamstime.com/b/happy-beautiful-young-indian-woman-looking-camera-toothy-smile-touching-face-facial-skin-leaning-chin-hand-resting-380277632.jpg",
    "https://www.shutterstock.com/image-photo/portrait-happy-indian-young-woman-260nw-2463004761.jpg",
    "https://c8.alamy.com/comp/3D2MDK8/portrait-of-positive-smiling-young-adult-indian-woman-in-t-shirt-hands-near-face-3D2MDK8.jpg",
    "https://www.shutterstock.com/image-photo/jewelry-portrait-smile-indian-woman-260nw-2648536503.jpg",
    "https://thumbs.dreamstime.com/b/outdoor-portrait-young-year-old-woman-long-dark-hair-wearing-black-turtle-neck-dress-139922002.jpg",
    "https://media.istockphoto.com/id/1299077582/photo/positivity-puts-you-in-a-position-of-power.jpg?s=612x612&w=0&k=20&c=baDuyrwRTscUZzyAqV44hnCq7d6tXUqwf26lJTcAE0A=",
    "https://www.shutterstock.com/image-photo/smiling-woman-3539-year-old-600nw-2684124133.jpg",
    "https://c8.alamy.com/comp/2C8DPHG/beautiful-woman-smiling-while-standing-on-city-street-during-sunny-day-2C8DPHG.jpg",
    "https://www.shutterstock.com/image-photo/smiling-indian-man-casual-attire-260nw-2513185639.jpg",
    "https://thumbs.dreamstime.com/b/headshot-happy-handsome-bearded-young-260nw-2347684061.jpg",
    "https://c8.alamy.com/comp/2RD4NMY/close-up-photo-portrait-of-young-hindu-student-man-smiling-and-looking-at-camera-businessman-outside-office-building-wearing-shirt-2RD4NMY.jpg",
    "https://thumbs.dreamstime.com/b/years-old-man-portrait-144396102.jpg",
    "https://static.vecteezy.com/system/resources/previews/045/782/633/non_2x/confident-businessman-in-modern-office-setting-professional-portrait-corporate-attire-natural-light-photo.jpg",
    "https://st3.depositphotos.com/2140881/37189/i/1600/depositphotos_371896760-stock-photo-young-indian-woman-sitting-park.jpg",
    "https://www.shutterstock.com/image-photo/young-asian-woman-smiling-warmly-600nw-2475700497.jpg",
    
    # Unsplash from Snippet 5
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1504257365157-1496a50d48f2?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&auto=format&fit=crop&q=60"
]

# RandomUser.me (total 200: men 0-99, women 0-99)
for i in range(100):
    new_images.append(f"https://randomuser.me/api/portraits/men/{i}.jpg")
    new_images.append(f"https://randomuser.me/api/portraits/women/{i}.jpg")

# Pravatar (total 50)
for i in range(101, 151):
    new_images.append(f"https://i.pravatar.cc/150?u={i}")

# Combine and deduplicate
all_images = list(dict.fromkeys(existing_images + new_images))

# Clean up any potential junk
all_images = [img for img in all_images if img and img.startswith("http")]

# Format the new profileImages array
new_images_str = "export const profileImages = [\n"
for img in all_images:
    new_images_str += f'    "{img}",\n'
new_images_str += "];"

# Replace in content
new_content = content.replace(f"export const profileImages = [{existing_images_str}];", new_images_str)

# Now update the generateRandomPeople logic to avoid repeats across rooms.
# We'll create a globally shared pool for the initialRooms generation.

initial_rooms_match = re.search(r'export const initialRooms = \[(.*?)\];', new_content, re.DOTALL)
if initial_rooms_match:
    # Instead of generateRandomPeople() in the array, let's modify the code above it.
    
    extra_code = """
// Shared pool for initial rooms to ensure NO REPEATS across all rooms
let globalImagePool = shuffleArray([...profileImages]);

const generateUniqueRandomPeople = () => {
    const numPeople = Math.floor(Math.random() * 7) + 4; // 4 to 10 people
    
    // We want to ensure uniqueness across ALL initial rooms
    if (globalImagePool.length < numPeople) {
        // Refill if empty, but shouldn't happen with ~750 images
        globalImagePool = shuffleArray([...profileImages]);
    }

    const selectedImages = [];
    for (let i = 0; i < numPeople; i++) {
        if (globalImagePool.length > 0) {
            selectedImages.push(globalImagePool.pop());
        }
    }

    return selectedImages.map(avatar_url => ({
        avatar_url,
        premium: Math.random() < 0.2
    }));
};
"""
    # Insert this before initialRooms
    new_content = new_content.replace("export const initialRooms", extra_code + "\nexport const initialRooms")
    
    # Replace all generateRandomPeople() with generateUniqueRandomPeople() in initialRooms
    new_content = new_content.replace("people: generateRandomPeople()", "people: generateUniqueRandomPeople()")

with open(existing_file, "w") as f:
    f.write(new_content)

print("Successfully updated profile images and unique room logic.")
