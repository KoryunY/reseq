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
const CIRCLE_SIZE = 80;

const CirclesScreen: React.FC<Props> = ({ navigation }) => {
    const [unlocked, setUnlocked] = useState<number[]>([]);

    const [selectedCircles, setSelectedCircles] = useState<number[]>([]);
    const [centralCircle, setCentralCircle] = useState(false);
    const [showPopup, setShowPopup] = useState<number | null>(null); // Track which circle's popup to show
    const [popupText, setPopupText] = useState<string>(''); // Store text for popup
    const animations = Array(6)
        .fill(null)
        .map(() => new Animated.Value(1)); // Initialize animations for each circle.

    const circlesData = [
        { x: width / 2 - 150, y: height / 2 - 250, text: 'Circle 1 Details' },
        { x: width / 2 + 50, y: height / 2 - 250, text: 'Circle 2 Details' },
        { x: width / 2 - 250, y: height / 2 - 150, text: 'Circle 3 Details' },
        { x: width / 2 + 150, y: height / 2 - 150, text: 'Circle 4 Details' },
        { x: width / 2 - 150, y: height / 2 - 50, text: 'Circle 5 Details' },
        { x: width / 2 + 50, y: height / 2 - 50, text: 'Circle 6 Details' },
    ];

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

    const handleTestButtonPress = () => {
        if (centralCircle) {
            navigation.navigate('WorkInProgress');
        } else if (selectedCircles.length === circlesData.length) {
            setCentralCircle(true);
        } else {
            setSelectedCircles([]);
        }
    };

    return (
        <View style={styles.container}>
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
                {circlesData.map((circle, index) => {
                    if (centralCircle) {
                        return (
                            <Line
                                key={`line-${index}`}
                                x1={circle.x + CIRCLE_SIZE / 2}
                                y1={circle.y + CIRCLE_SIZE / 2}
                                x2={width / 2}
                                y2={height / 2}
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
                        <Text style={styles.circleText}>{circle.text}</Text>
                    </TouchableOpacity>

                    {/* Info Button */}
                    <TouchableOpacity
                        style={[styles.infoButton, { top: -20, left: CIRCLE_SIZE / 2 - 15 }]}
                        onPress={() => handlePopupPress(index, circle.text)}
                    >
                        <Text style={styles.infoText}>i</Text>
                    </TouchableOpacity>
                </Animated.View>
            ))}

            {centralCircle && (
                <View
                    style={[
                        styles.circle,
                        {
                            top: height / 2 - CIRCLE_SIZE / 2,
                            left: width / 2 - CIRCLE_SIZE / 2,
                            borderColor: 'white',
                        },
                    ]}
                >
                    <Text style={styles.circleText}>Central</Text>
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
        fontSize: 14,
    },
    infoButton: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 4,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        color: 'black',
        fontSize: 14,
    },
    popup: {
        position: 'absolute',
        width: 300,
        height: 150,
        backgroundColor: 'black',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: height / 2 - 75,
        left: width / 2 - 150,
    },
    popupText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    testButton: {
        position: 'absolute',
        bottom: 40,
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    testButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
});
