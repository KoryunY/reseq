import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    PanResponder,
} from 'react-native';
import { RootStackParamList } from '../../app';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'CirclesScreen'>;
};

const HoldingHandsScreen: React.FC<Props> = ({ navigation }) => {
    const [isHoldingHands, setIsHoldingHands] = useState(false);
    const [positionsSwapped, setPositionsSwapped] = useState(false);
    const [rejection, setRejection] = useState(false);
    const [showContinue, setShowContinue] = useState(false);
    const [girlPosition, setGirlPosition] = useState({ x: 0, y: 0 });
    const [textShown, setTextShown] = useState(false);
    const [girlInSquare, setGirlInSquare] = useState(false);
    const [currentSide, setCurrentSide] = useState<'left' | 'right' | 'none'>('none');

    const handlePlacement = (side: 'left' | 'right') => {
        if (side === 'left') {
            setRejection(true);
            setGirlInSquare(false);
            setTimeout(() => setRejection(false), 1000); // Clear rejection after 1 second
        } else if (side === 'right') {
            setIsHoldingHands(true);
            setGirlInSquare(false);
            setTimeout(() => {
                setPositionsSwapped(true);
                setShowContinue(true);
            }, 3000); // Swap positions after 3 seconds
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setTextShown(true);
        }, 2000); // Show text after 2 seconds

        return () => clearTimeout(timeout);
    }, []);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
            if (girlInSquare) {
                setGirlPosition({
                    x: gestureState.moveX - 40,
                    y: gestureState.moveY - 40,
                });
            }
        },
        onPanResponderRelease: (e, gestureState) => {
            if (gestureState.moveX < 100) {
                setCurrentSide('left');
                handlePlacement('left');
            } else if (gestureState.moveX > 300) {
                setCurrentSide('right');
                handlePlacement('right');
            } else {
                setGirlPosition({ x: 150, y: 150 });
                setCurrentSide('none');
            }
        },
    });

    return (
        <View style={styles.container}>
            {/* Text that appears initially */}
            {!textShown && (
                <View style={styles.textContainer}>
                    <Text style={styles.runningText}>The girl is unsure where to stand...</Text>
                </View>
            )}

            {/* Game area */}
            {textShown && !positionsSwapped && (
                <View style={styles.street}>
                    {/* Left Square */}
                    <View
                        style={[styles.square, { left: 50, top: '30%' }]}
                        onLayout={() => setGirlInSquare(true)}
                    >
                        <Text style={styles.squareText}>Left</Text>
                    </View>

                    {/* Boy in the middle */}
                    <Image source={require('../../assets/images/boy.png')} style={styles.character} />

                    {/* Right Square */}
                    <View
                        style={[styles.square, { right: 50, top: '30%' }]}
                        onLayout={() => setGirlInSquare(true)}
                    >
                        <Text style={styles.squareText}>Right</Text>
                    </View>

                    {/* Girl Image (dragged) */}
                    <Image
                        source={require('../../assets/images/girl.png')}
                        style={[
                            styles.character,
                            {
                                position: 'absolute',
                                top: girlPosition.y,
                                left: girlPosition.x,
                            },
                        ]}
                        {...panResponder.panHandlers}
                    />
                </View>
            )}

            {/* Rejection or Handholding Message */}
            {rejection && <Text style={styles.rejectionText}>No! She must be on the right.</Text>}
            {isHoldingHands && !positionsSwapped && <Text style={styles.holdingText}>They are holding hands ❤️</Text>}

            {/* Continue Button */}
            {showContinue && positionsSwapped && (
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => navigation.navigate('WorkInProgress')}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default HoldingHandsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        marginBottom: 30,
    },
    runningText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    street: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        height: '60%',
        backgroundColor: '#000',
        padding: 20,
        position: 'relative',
    },
    character: {
        width: 80,
        height: 80,
    },
    square: {
        width: 80,
        height: 80,
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    squareText: {
        color: 'white',
        fontSize: 16,
    },
    rejectionText: {
        color: 'red',
        fontSize: 18,
        marginTop: 10,
    },
    holdingText: {
        color: 'green',
        fontSize: 18,
        marginTop: 10,
    },
    continueButton: {
        borderColor: 'white',
        borderWidth: 2,
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
