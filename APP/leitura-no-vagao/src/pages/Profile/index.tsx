import { DrawerActions, RouteProp } from "@react-navigation/native";
import { Image, Keyboard, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import { RootStackParamList } from "../../routes/app.routes";
import { StackNavigationProp } from "@react-navigation/stack";
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { styles } from './styles';

// icons
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTheme } from '@react-navigation/native'
import { TextInputMask } from "react-native-masked-text";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

type ProfileProps = {
    route: RouteProp<RootStackParamList, 'Profile'>;
    navigation: StackNavigationProp<RootStackParamList, 'Profile'>;
}; 

export function Profile({ route, navigation }: ProfileProps) {
    const { user } = route.params;
    const [name, setName] = useState<string>(user.nome || '');
    const [email, setEmail] = useState<string>(user.email || '');
    const [phone, setPhone] = useState<string>(user.telefone || '');
    const [password, setPassword] = useState<string>(user.nome || '');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [errors, setErrors] = useState({ name: false, email: false, phone: false, password: false });

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [dialogTitle, setDialogTitle] = useState<string>('');
    const [dialogMessage, setDialogMessage] = useState<string>('');
    const [dialogType, setDialogType] = useState<'alert' | 'warning' | 'success' | 'fail'>('alert');

    const showDialog = (title: string, message: string, type: 'alert' | 'warning' | 'success' | 'fail') => {
        setDialogTitle(title);
        setDialogMessage(message);
        setDialogType(type);
        setVisible(true);
    };

    //Abre o Drawer
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    // Toggle editing mode
    const toggleEditing = () => {
        if (isEditing) {
            // Save changes
            showDialog("Sucesso", "Informações atualizadas com sucesso", "success");
        }
        setIsEditing(!isEditing);
    };

    // Toggle modal visibility
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };


    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={styles.container}>

                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)} style={styles.backButton}>
                            <Icon name="arrow-back-outline" size={24} color={styles.backArrowColor.color} />
                        </TouchableOpacity>
                    </View>
                    <Icon name="list-outline" size={25} style={styles.menuIcon} onPress={openDrawer}/>
                </View>

                <Text style={styles.welcome}>Minha conta</Text>
            
                {/* profile image container */}
                <View style={styles.profileImageContainer}>
                    <Image source={require("../../assets/user-profile.jpg")} style={styles.profileImage} />
                    <TouchableOpacity style={[styles.editIconContainer, {backgroundColor: '#073F72'}]} onPress={toggleModal}>
                        <Feather name={"edit-3"} size={12} color={'#FFFFFF'}/>
                    </TouchableOpacity>
                </View>


                {/* profile details contaienr */}
                <View style={styles.nameRoleContainer}>
                    <Text style={[styles.name]}>{user.nome}</Text>
                    <Text style={[styles.role]}>{user.role}</Text>
                </View>


                {/* Input Fields Container */}
                <View style={styles.inputFieldsContainer}>
                    
                    {/* Name Input */}
                    <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
                        <Text style={styles.label}>Nome</Text>
                        <View style={styles.viewInput}>
                        <Icon name="person-outline" size={18} style={styles.icon} />
                        <TextInput
                            placeholder="Insira seu nome"
                            style={[styles.searchInput, styles.input]}
                            value={name}
                            onChangeText={setName}
                            editable={isEditing}
                        />
                        <TouchableOpacity onPress={() => {}}>
                            {isEditing ?
                                <Icon name="lock-open-outline" size={18} style={styles.searchIcon} />
                                :
                                <Icon name="lock-closed-outline" size={18} style={styles.searchIcon} />
                            }
                        </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Email Input */}
                    <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.viewInput}>
                        <Icon name="mail-outline" size={18} style={styles.icon} />
                        <TextInput
                            placeholder="Insira seu email"
                            style={[styles.searchInput, styles.input, errors.email && { borderColor: 'red', borderWidth: 1 }]}
                            value={email}
                            onChangeText={setEmail}
                            editable={isEditing}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => {}}>
                            {isEditing ?
                                <Icon name="lock-open-outline" size={18} style={styles.searchIcon} />
                                :
                                <Icon name="lock-closed-outline" size={18} style={styles.searchIcon} />
                            }
                        </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Phone Input */}
                    <Animated.View entering={FadeInDown.delay(450).duration(5000).springify()}>
                        <Text style={styles.label}>Telefone</Text>
                        <View style={styles.viewInput}>
                        <Icon name="call-outline" size={18} style={styles.icon} />
                        <TextInputMask
                            style={[styles.searchInput, styles.input, errors.email && { borderColor: 'red', borderWidth: 1 }]}
                            placeholder="Insira o número do seu telefone"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            type={'cel-phone'}
                            editable={isEditing}
                            options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) '
                            }}
                        />
                        <TouchableOpacity onPress={() => {}}>
                            {isEditing ?
                                <Icon name="lock-open-outline" size={18} style={styles.searchIcon} />
                                :
                                <Icon name="lock-closed-outline" size={18} style={styles.searchIcon} />
                            }
                        </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Modal for options */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={toggleModal}
                    >
                        <View style={styles.modalOverlay}>
                            <Animated.View entering={SlideInUp.duration(400)} style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Escolha uma opção</Text>
                                <Pressable style={styles.modalButton} onPress={() => { /* Lógica para alterar foto */ }}>
                                    <Text style={styles.modalButtonText}>Alterar a foto</Text>
                                </Pressable>
                                <Pressable style={styles.modalButton} onPress={() => { /* Lógica para alterar dados pessoais */ }}>
                                    <Text style={styles.modalButtonText}>Alterar os dados pessoais</Text>
                                </Pressable>
                                <Pressable style={styles.modalButton} onPress={() => { /* Lógica para alterar senha */ }}>
                                    <Text style={styles.modalButtonText}>Alterar a senha</Text>
                                </Pressable>
                                <Pressable style={styles.modalCloseButton} onPress={toggleModal}>
                                    <Text style={styles.modalCloseButtonText}>Cancelar</Text>
                                </Pressable>
                            </Animated.View>
                        </View>
                    </Modal>

                    {/* Update Button */}
                    <TouchableOpacity style={styles.button} onPress={toggleEditing}>
                        <Text style={styles.buttonText}>
                            {isEditing ? "Salvar" : "Atualizar Informações"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}