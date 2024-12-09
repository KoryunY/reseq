import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Easing,
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { RootStackParamList } from '../../app';
import Header from '../components/Header';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'CirclesScreen'>;
};

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width, height) * 0.12; // Scaled based on the smallest dimension.
const centralText = `This love represents a balance between intense romantic attraction (Eros) and a deeper emotional connection (Companionate Love, Philia). It encapsulates the exciting yet stable affection that develops in the early stages of a relationship. The influence of Ludus adds a playful, lighthearted element, while Intellectual Love brings a thoughtful, stimulating dimension to the bond. Together, it forms a multifaceted connection that is both passionate and enduring.`;

const CirclesScreen: React.FC<Props> = ({ navigation }) => {
    const [selectedCircles, setSelectedCircles] = useState<number[]>([]);
    const [centralCircle, setCentralCircle] = useState(false);
    const [showPopup, setShowPopup] = useState<number | null>(null); // Track which circle's popup to show
    const [popupText, setPopupText] = useState<string>(''); // Store text for popup
    const animations = Array(15)
        .fill(null)
        .map(() => new Animated.Value(1)); // Initialize animations for each circle.
    const winingCircles = [0, 1, 4, 8, 13];
    const texts = [
        { name: "Eros", text: "Passionate, physical, and sensual love. Often associated with attraction and desire." },
        { name: "Philia", text: "Affectionate love between friends who share mutual respect, care, and common interests." },
        { name: "Storge", text: "Love that develops naturally between family members, such as parents, children, and siblings." },
        { name: "Agape", text: "Unconditional love for all beings, often associated with altruism or spiritual love." },
        { name: "Ludus", text: "Flirtatious, playful affection, often found in the early stages of attraction." },
        { name: "Pragma", text: "Practical and committed love that grows over time." },
        { name: "Mania", text: "Intense and possessive love that can lead to jealousy and dependence." },
        { name: "Philautia", text: "The love and appreciation you have for yourself. Can be healthy or unhealthy." },
        { name: "Companionate Love", text: "Deep affection that lacks the intensity of romantic love but provides comfort and stability." },
        { name: "Unrequited Love", text: "Love that is not reciprocated by the other person." },
        { name: "Platonic Love", text: "Non-romantic love that emphasizes emotional closeness and mutual respect." },
        { name: "Infatuation", text: "A superficial, short-lived passion or admiration for someone." },
        { name: "Spiritual Love", text: "Love rooted in spiritual beliefs or a connection with a higher power." },
        { name: "Intellectual Love", text: "A deep admiration for someone’s intellect and ideas." },
        { name: "Unconditional Love", text: "Pure, unwavering love without limitations or conditions." }
    ];


    // Dynamically calculate positions
    const calculateCirclePositions = () => {
        const radius = Math.min(width, height) / 3; // Adjust the radius as needed
        const angleStep = (2 * Math.PI) / 15; // Divide full circle into 15 parts
        const positions = [];

        for (let i = 0; i < 15; i++) {
            const angle = i * angleStep;
            const x = width / 2 + radius * Math.cos(angle) - CIRCLE_SIZE / 2;
            const y = height / 2 + radius * Math.sin(angle) - CIRCLE_SIZE / 2;
            positions.push({ x, y, text: texts[i].text, name: texts[i].name });
        }

        return positions;
    };

    const circlesData = calculateCirclePositions();

    const handleCirclePress = (index: number) => {
        if (!selectedCircles.includes(index)) {
            Animated.spring(animations[index], {
                toValue: 1.5,
                useNativeDriver: true,
            }).start(() => {
                Animated.spring(animations[index], {
                    toValue: 1,
                    useNativeDriver: true,
                }).start();
            });

            setSelectedCircles([...selectedCircles, index]);
        } else {
            setSelectedCircles(selectedCircles.filter((c) => c !== index));
        }
    };

    const handlePopupPress = (index: number, text: string) => {
        setShowPopup(index); // Show the popup for the selected circle
        setPopupText(text); // Set the text for the popup
    };

    const closePopup = () => {
        setShowPopup(null); // Close the popup
    };

    const areArraysEqual = (arr1: any[], arr2: any[]) => {
        if (arr1.length !== arr2.length) return false;

        // Sort both arrays
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        // Compare elements
        return sorted1.every((value, index) => value === sorted2[index]);
    }

    const handleTestButtonPress = () => {
        if (centralCircle) {
            navigation.navigate('GameScreen');
        } else if (areArraysEqual(selectedCircles, winingCircles)) {
            setCentralCircle(true);
        } else {
            setSelectedCircles([]);
        }
    };

    return (
        <View style={styles.container}>
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
                {circlesData.map((circle, index) => {
                    if (centralCircle && winingCircles.includes(index)) {
                        return (
                            <Line
                                key={`line-${index}`}
                                x1={circle.x + CIRCLE_SIZE / 2}
                                y1={circle.y + CIRCLE_SIZE / 2}
                                x2={width / 2}
                                y2={height / 2 - CIRCLE_SIZE * 2 + 25}
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="4 4" // Dotted line
                            />
                        );
                    }
                    return null;
                })}
            </Svg>

            {circlesData.map((circle, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.circle,
                        {
                            transform: [{ scale: animations[index] }],
                            top: circle.y,
                            left: circle.x,
                            borderColor: selectedCircles.includes(index)
                                ? 'white'
                                : 'grey',
                        },
                    ]}
                >
                    <TouchableOpacity onPress={() => handleCirclePress(index)}>
                        <Text style={styles.circleText}>{circle.name}</Text>
                    </TouchableOpacity>

                    {/* Info Button */}
                    <TouchableOpacity
                        style={[styles.infoButton, { top: 0, left: CIRCLE_SIZE / 2 }]}
                        onPress={() => handlePopupPress(index, circle.text)}
                    >
                        <Text style={styles.infoText}>?</Text>
                    </TouchableOpacity>
                </Animated.View>
            ))}

            {centralCircle && (
                <View
                    style={[
                        styles.circle,
                        {
                            top: height / 2 - CIRCLE_SIZE * 2,
                            left: width / 2 - CIRCLE_SIZE / 2,
                            borderColor: 'white',
                        },
                    ]}
                >
                    <Text style={styles.circleText}>Rayaa? :3</Text>
                </View>
            )}

            {/* Popup for details */}
            {showPopup !== null && (
                <Animated.View
                    style={[
                        styles.popup,
                        {
                            transform: [
                                {
                                    scale: showPopup !== null ? new Animated.Value(1.5) : new Animated.Value(1),
                                },
                            ],
                        },
                    ]}
                >
                    <Text style={styles.popupText}>{popupText}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            <TouchableOpacity style={styles.testButton} onPress={handleTestButtonPress}>
                <Text style={styles.testButtonText}>
                    {centralCircle ? 'Continue' : 'Test'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CirclesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heart: {
        width: CIRCLE_SIZE * 2, // Increase width for heart shape
        height: CIRCLE_SIZE, // Adjust height for heart shape
        borderColor: 'white',
        borderWidth: 2, // Border width for the outline
        backgroundColor: 'transparent',
        position: 'absolute',
        top: height / 2 - CIRCLE_SIZE * 1.5, // Center vertically
        left: width / 2 - CIRCLE_SIZE, // Center horizontally
        transform: [
            { rotate: '45deg' }, // Create the rotated heart shape
        ],
    },
    circle: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    circleText: {
        color: 'white',
        fontSize: CIRCLE_SIZE * 0.15, // Responsive text size
        textAlign: 'center',
    },
    infoButton: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        width: CIRCLE_SIZE * 0.25,
        height: CIRCLE_SIZE * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        top: -CIRCLE_SIZE * 0.3,
        left: CIRCLE_SIZE * 0.7,
    },
    infoText: {
        color: 'black',
        fontSize: CIRCLE_SIZE * 0.15,
    },
    popup: {
        position: 'static',
        width: '50%', // Define width to constrain text
        //maxWidth: 300, // Optional: Prevent the popup from being too wide
        height: 'auto', // Allow height to adjust based on content
        padding: 20, // Add padding for better layout
        backgroundColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: height / 2 - 75,
        left: width / 2 - (width * 0.8) / 2, // Center horizontally
    },
    popupText: {
        color: 'white',
        fontSize: height * 0.02,
        textAlign: 'center',
        marginBottom: 20,
        width: '80%', // Ensure text is constrained within a width
        flexWrap: 'wrap', // Enable wrapping
        alignSelf: 'center', // Center within the popup
    },
    closeButton: {
        position: 'absolute',
        top: '5%', // Adjust to maintain consistent spacing relative to the popup
        right: '10%',
        backgroundColor: 'white',
        borderRadius: 50, // Ensures a circular shape
        width: height * 0.03, // Scales with screen size for better responsiveness
        height: height * 0.03, // Matches width for perfect circle
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Adds shadow on Android
        shadowColor: 'black', // Adds shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    testButton: {
        position: 'absolute',
        bottom: height * 0.05,
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    testButtonText: {
        fontSize: height * 0.02,
        fontWeight: 'bold',
        color: 'black',
    },
});
// import { StackNavigationProp } from '@react-navigation/stack';
// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Animated,
//     Dimensions,
//     Easing,
// } from 'react-native';
// import Svg, { Line } from 'react-native-svg';
// import { RootStackParamList } from '../../app';
// import Header from '../components/Header';

// type Props = {
//     navigation: StackNavigationProp<RootStackParamList, 'CirclesScreen'>;
// };

// const { width, height } = Dimensions.get('window');
// const CIRCLE_SIZE = Math.min(width, height) * 0.12; // Scaled based on the smallest dimension.


// const CirclesScreen: React.FC<Props> = ({ navigation }) => {
//     const [unlocked, setUnlocked] = useState<number[]>([]);

//     const [selectedCircles, setSelectedCircles] = useState<number[]>([]);
//     const [centralCircle, setCentralCircle] = useState(false);
//     const [showPopup, setShowPopup] = useState<number | null>(null); // Track which circle's popup to show
//     const [popupText, setPopupText] = useState<string>(''); // Store text for popup
//     const animations = Array(6)
//         .fill(null)
//         .map(() => new Animated.Value(1)); // Initialize animations for each circle.

//     const circlesData = [
//         { x: width * 0.25, y: height * 0.2, text: 'Circle 1 Details' },
//         { x: width * 0.75 - CIRCLE_SIZE, y: height * 0.2, text: 'Circle 2 Details' },
//         { x: width * 0.1, y: height * 0.4, text: 'Circle 3 Details' },
//         { x: width * 0.9 - CIRCLE_SIZE, y: height * 0.4, text: 'Circle 4 Details' },
//         { x: width * 0.25, y: height * 0.6, text: 'Circle 5 Details' },
//         { x: width * 0.75 - CIRCLE_SIZE, y: height * 0.6, text: 'Circle 6 Details' },
//     ];


//     // const circlesData = [
//     //     { x: width / 2 - 150, y: height / 2 - 250, text: 'Circle 1 Details' },
//     //     { x: width / 2 + 50, y: height / 2 - 250, text: 'Circle 2 Details' },
//     //     { x: width / 2 - 250, y: height / 2 - 150, text: 'Circle 3 Details' },
//     //     { x: width / 2 + 150, y: height / 2 - 150, text: 'Circle 4 Details' },
//     //     { x: width / 2 - 150, y: height / 2 - 50, text: 'Circle 5 Details' },
//     //     { x: width / 2 + 50, y: height / 2 - 50, text: 'Circle 6 Details' },
//     // ];

//     const handleCirclePress = (index: number) => {
//         if (!selectedCircles.includes(index)) {
//             Animated.spring(animations[index], {
//                 toValue: 1.5,
//                 useNativeDriver: true,
//             }).start(() => {
//                 Animated.spring(animations[index], {
//                     toValue: 1,
//                     useNativeDriver: true,
//                 }).start();
//             });

//             setSelectedCircles([...selectedCircles, index]);
//         } else {
//             setSelectedCircles(selectedCircles.filter((c) => c !== index));
//         }
//     };

//     const handlePopupPress = (index: number, text: string) => {
//         setShowPopup(index); // Show the popup for the selected circle
//         setPopupText(text); // Set the text for the popup
//     };

//     const closePopup = () => {
//         setShowPopup(null); // Close the popup
//     };

//     const handleTestButtonPress = () => {
//         if (centralCircle) {
//             navigation.navigate('GameScreen');
//         } else if (selectedCircles.length === circlesData.length) {
//             setCentralCircle(true);
//         } else {
//             setSelectedCircles([]);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
//                 {circlesData.map((circle, index) => {
//                     if (centralCircle) {
//                         return (
//                             <Line
//                                 key={`line-${index}`}
//                                 x1={circle.x + CIRCLE_SIZE / 2}
//                                 y1={circle.y + CIRCLE_SIZE / 2}
//                                 x2={width / 2}
//                                 y2={height / 2 - CIRCLE_SIZE * 2 + 25}
//                                 stroke="white"
//                                 strokeWidth="2"
//                                 strokeDasharray="4 4" // Dotted line
//                             />
//                         );
//                     }
//                     return null;
//                 })}
//             </Svg>

//             {circlesData.map((circle, index) => (
//                 <Animated.View
//                     key={index}
//                     style={[
//                         styles.circle,
//                         {
//                             transform: [{ scale: animations[index] }],
//                             top: circle.y,
//                             left: circle.x,
//                             borderColor: selectedCircles.includes(index)
//                                 ? 'white'
//                                 : 'grey',
//                         },
//                     ]}
//                 >
//                     <TouchableOpacity onPress={() => handleCirclePress(index)}>
//                         <Text style={styles.circleText}>{circle.text}</Text>
//                     </TouchableOpacity>

//                     {/* Info Button */}
//                     <TouchableOpacity
//                         style={[styles.infoButton, { top: -25, left: CIRCLE_SIZE / 2 + 5 }]}
//                         onPress={() => handlePopupPress(index, circle.text)}
//                     >
//                         <Text style={styles.infoText}>i</Text>
//                     </TouchableOpacity>
//                 </Animated.View>
//             ))}

//             {centralCircle && (
//                 <View
//                     style={[
//                         styles.circle,
//                         {
//                             top: height / 2 - CIRCLE_SIZE * 2,
//                             left: width / 2 - CIRCLE_SIZE / 2,
//                             borderColor: 'white',
//                         },
//                     ]}
//                 >
//                     <Text style={styles.circleText}>Central Circle</Text>
//                 </View>
//             )}

//             {/* Popup for details */}
//             {showPopup !== null && (
//                 <Animated.View
//                     style={[
//                         styles.popup,
//                         {
//                             transform: [
//                                 {
//                                     scale: showPopup !== null ? new Animated.Value(1.5) : new Animated.Value(1),
//                                 },
//                             ],
//                         },
//                     ]}
//                 >
//                     <Text style={styles.popupText}>{popupText}</Text>
//                     <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
//                         <Text style={styles.closeButtonText}>X</Text>
//                     </TouchableOpacity>
//                 </Animated.View>
//             )}

//             <TouchableOpacity style={styles.testButton} onPress={handleTestButtonPress}>
//                 <Text style={styles.testButtonText}>
//                     {centralCircle ? 'Continue' : 'Test'}
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default CirclesScreen;


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'black',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     circle: {
//         position: 'absolute',
//         width: CIRCLE_SIZE,
//         height: CIRCLE_SIZE,
//         borderRadius: CIRCLE_SIZE / 2,
//         borderWidth: 2,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//     },
//     circleText: {
//         color: 'white',
//         fontSize: CIRCLE_SIZE * 0.15, // Responsive text size
//         textAlign: 'center',
//     },
//     infoButton: {
//         position: 'absolute',
//         backgroundColor: 'white',
//         borderRadius: 4,
//         width: CIRCLE_SIZE * 0.25,
//         height: CIRCLE_SIZE * 0.25,
//         justifyContent: 'center',
//         alignItems: 'center',
//         top: -CIRCLE_SIZE * 0.3,
//         left: CIRCLE_SIZE * 0.7,
//     },
//     infoText: {
//         color: 'black',
//         fontSize: CIRCLE_SIZE * 0.15,
//     },
//     popup: {
//         position: 'absolute',
//         width: width * 0.7,
//         height: height * 0.2,
//         backgroundColor: 'black',
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//         top: height * 0.4,
//         left: width * 0.15,
//     },
//     popupText: {
//         color: 'white',
//         fontSize: height * 0.02,
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//         backgroundColor: 'white',
//         borderRadius: 15,
//         width: 25,
//         height: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         color: 'black',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     testButton: {
//         position: 'absolute',
//         bottom: height * 0.05,
//         padding: 12,
//         backgroundColor: 'white',
//         borderRadius: 8,
//     },
//     testButtonText: {
//         fontSize: height * 0.02,
//         fontWeight: 'bold',
//         color: 'black',
//     },
// });


// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: 'black',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //     },
// //     circle: {
// //         position: 'absolute',
// //         width: CIRCLE_SIZE,
// //         height: CIRCLE_SIZE,
// //         borderRadius: CIRCLE_SIZE / 2,
// //         borderWidth: 2,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'black',
// //     },
// //     circleText: {
// //         color: 'white',
// //         fontSize: 14,
// //         left: 15,
// //     },
// //     infoButton: {
// //         position: 'absolute',
// //         backgroundColor: 'white',
// //         borderRadius: 4,
// //         width: 20,
// //         height: 20,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     infoText: {
// //         color: 'black',
// //         fontSize: 14,
// //     },
// //     popup: {
// //         position: 'absolute',
// //         width: 300,
// //         height: 150,
// //         backgroundColor: 'black',
// //         borderRadius: 10,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         top: height / 2 - 75,
// //         left: width / 2 - 150,
// //     },
// //     popupText: {
// //         color: 'white',
// //         fontSize: 18,
// //         textAlign: 'center',
// //         marginBottom: 20,
// //     },
// //     closeButton: {
// //         position: 'absolute',
// //         top: 10,
// //         right: 10,
// //         backgroundColor: 'white',
// //         borderRadius: 15,
// //         width: 25,
// //         height: 25,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     closeButtonText: {
// //         color: 'black',
// //         fontWeight: 'bold',
// //         fontSize: 16,
// //     },
// //     testButton: {
// //         position: 'absolute',
// //         bottom: 40,
// //         padding: 12,
// //         backgroundColor: 'white',
// //         borderRadius: 8,
// //     },
// //     testButtonText: {
// //         fontSize: 16,
// //         fontWeight: 'bold',
// //         color: 'black',
// //     },
// // });
