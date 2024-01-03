import 'expo-router/entry'
import 'react-native-url-polyfill/auto';
import 'node-libs-react-native/globals'
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }