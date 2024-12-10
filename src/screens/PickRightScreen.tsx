import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    PanResponder,
    Animated,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { RootStackParamList } from '../../app';

type Figure = {
    id: number;
    type: 'correct' | 'incorrect';
    x: Animated.Value;
    y: Animated.Value;
    source: any;
};

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'CirclesScreen'>;
};
const { width, height } = Dimensions.get('window');

const outerFigures: Figure[] = [
    { id: 1, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect.png") },
    { id: 2, type: 'correct', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/correct.png") },
    { id: 3, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect1.png") },
    { id: 4, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect2.png") },
    { id: 5, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect3.png") },
    { id: 6, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect4.png") },
    { id: 7, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect5.png") },
    { id: 8, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect6.png") },
    { id: 9, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect7.png") },
    { id: 10, type: 'incorrect', x: new Animated.Value(0), y: new Animated.Value(0), source: require("../../assets/images/incorrect8.png") },
]

const PickRightScreen: React.FC<Props> = ({ navigation }) => {
    const [figures, setFigures] = useState<Figure[]>([...outerFigures]);

    const [message, setMessage] = useState<string>('');
    const [dropZoneLayout, setDropZoneLayout] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    const [trashCanLayout, setTrashCanLayout] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    const handleDropZoneLayout = (event: any) => {
        const layout = event.nativeEvent.layout;
        setDropZoneLayout({
            x: layout.x,
            y: layout.y,
            width: layout.width,
            height: layout.height,
        });
    };

    const handleRestart = () => {
        setFigures([...outerFigures]);
    };

    const handleTrashCanLayout = (event: any) => {
        const layout = event.nativeEvent.layout;
        setTrashCanLayout({
            x: layout.x,
            y: layout.y,
            width: layout.width,
            height: layout.height,
        });
    };

    const isInsideDropZone = (gesture: any) => {
        if (!dropZoneLayout) return false;
        const { moveX, moveY } = gesture;
        return (
            moveX > dropZoneLayout.x &&
            moveX < dropZoneLayout.x + dropZoneLayout.width &&
            moveY > dropZoneLayout.y &&
            moveY < dropZoneLayout.y + dropZoneLayout.height
        );
    };

    const isInsideTrashCan = (gesture: any) => {
        if (!trashCanLayout) return false;
        const { moveX, moveY } = gesture;
        return (
            moveX > trashCanLayout.x &&
            moveX < trashCanLayout.x + trashCanLayout.width &&
            moveY > trashCanLayout.y &&
            moveY < trashCanLayout.y + trashCanLayout.height
        );
    };

    const panResponder = (figure: Figure) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                figure.x.setValue(gestureState.dx);
                figure.y.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (isInsideDropZone(gestureState)) {
                    if (figure.type === 'correct') {
                        //setMessage('Correct choice!');
                        setFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
                        navigation.navigate("PhotoConstructor")
                    }
                    // else {
                    //     setMessage('Invalid choice! Try again or dispose.');
                    // }
                } else if (isInsideTrashCan(gestureState)) {
                    //setMessage('Disposed!');
                    setFigures((prev) => prev.filter((fig) => fig.id !== figure.id));
                } else {
                    // Reset position
                    Animated.spring(figure.x, { toValue: 0, useNativeDriver: false }).start();
                    Animated.spring(figure.y, { toValue: 0, useNativeDriver: false }).start();
                }
            },
        });

    return (
        <View style={styles.container}>
            {/* <Text style={styles.instructions}>Drag the correct figure to the white square or dispose invalid ones in the trash can!</Text> */}

            <View style={styles.dropZone} onLayout={handleDropZoneLayout} />
            <View style={styles.trashCan} onLayout={handleTrashCanLayout}>
                <Text style={styles.trashText}>🗑️</Text>
            </View>

            <View style={styles.stackContainer}>
                {figures?.length > 0 ? figures.map((figure) => (
                    <Animated.View
                        key={figure.id}
                        style={[
                            styles.figure,
                            { transform: [{ translateX: figure.x }, { translateY: figure.y }] },
                        ]}
                        {...panResponder(figure).panHandlers}
                    >
                        <Image
                            source={
                                figure.source
                            }
                            style={styles.image}
                        />
                    </Animated.View>
                )) : (
                    <TouchableOpacity style={styles.testButton} onPress={handleRestart}>
                        <Text style={styles.testButtonText}>Restart</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* {message && <Text style={styles.message}>{message}</Text>} */}
        </View>
    );
};

export default PickRightScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    testButton: {
        position: 'absolute',
        bottom: -height * 0.05,
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    testButtonText: {
        fontSize: height * 0.02,
        fontWeight: 'bold',
        color: 'black',
    },
    instructions: {
        color: 'white',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    dropZone: {
        width: 150,
        height: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
    },
    trashCan: {
        width: 150,
        height: 150,
        backgroundColor: 'red',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    trashText: {
        color: 'white',
        fontSize: 18,
    },
    stackContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    figure: {
        position: 'absolute',
        width: 140,
        height: 140,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        borderWidth: 2, // Width of the white outline
        borderColor: 'white', // White border color
    },
    message: {
        color: 'yellow',
        fontSize: 18,
        marginVertical: 10,
    },
});
