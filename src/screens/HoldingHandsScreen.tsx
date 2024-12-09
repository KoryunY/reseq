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
    const [positionsCorrect, setPositionsCorrect] = useState(false);
    const [girlPosition, setGirlPosition] = useState({ x: 160, y: 260 });
    const [boyPosition, setBoyPosition] = useState({ x: 160, y: -100 });

    // Handle the placement of the images inside the squares
    const handlePlacement = () => {
        if (boyPosition.x < 150 && girlPosition.x > 250) {
            setPositionsCorrect(true);
        } else {
            setPositionsCorrect(false);
        }
    };

    // Set up pan responder for the girl's position
    const girlPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
            setGirlPosition({
                x: gestureState.moveX - 40,
                y: gestureState.moveY - 40,
            });
        },
        onPanResponderRelease: handlePlacement,
    });

    // Set up pan responder for the boy's position
    const boyPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
            setBoyPosition({
                x: gestureState.moveX - 40,
                y: gestureState.moveY - 40,
            });
        },
        onPanResponderRelease: handlePlacement,
    });

    return (
        <View style={styles.container}>
            {/* Game area */}
            {!positionsCorrect ? (
                <View style={styles.street}>
                    {/* Left Square for Boy */}
                    <View style={[styles.square, { left: 50, top: '30%' }]}>
                        <Text style={styles.squareText}>Left</Text>
                    </View>

                    {/* Boy Image */}
                    <Image
                        source={require('../../assets/images/boy.png')}
                        style={[
                            styles.character,
                            { position: 'absolute', top: boyPosition.y, left: boyPosition.x },
                        ]}
                        {...boyPanResponder.panHandlers}
                    />

                    {/* Right Square for Girl */}
                    <View style={[styles.square, { right: 50, top: '30%' }]}>
                        <Text style={styles.squareText}>Right</Text>
                    </View>

                    {/* Girl Image */}
                    <Image
                        source={require('../../assets/images/girl.png')}
                        style={[
                            styles.character,
                            { position: 'absolute', top: girlPosition.y, left: girlPosition.x },
                        ]}
                        {...girlPanResponder.panHandlers}
                    />
                </View>
            ) : (
                <View style={styles.successContainer}>
                    {/* Display the 'together' image when correct positions are achieved */}
                    <Image source={require('../../assets/images/together.png')} style={styles.togetherImage} />

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => navigation.navigate('PickRightScreen')}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
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
    square: {
        width: 80,
        height: 160,
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
    character: {
        width: 80,
        height: 160,
    },
    successContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    togetherImage: {
        width: 200,
        height: 200,
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

export default HoldingHandsScreen;
