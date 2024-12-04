import { useState } from 'react';

const App = () => {
  const [key, setKey] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  const [encryptedMessage, setEncryptedMessage] = useState();
  const [encryptedErrorMessage, setEncryptedErrorMessage] = useState();

  const [decryptedMessage, setDecryptedMessage] = useState();
  const [decryptedErrorMessage, setDecryptedErrorMessage] = useState();

  const keyReady = key.length > 0;
  const letterA = 97;
  const letterZ = 122;

  const calcCryptoKey = () => {
    const plainValue = document
      .getElementById('plain-input')
      ?.value?.toLowerCase();
    const encryptedValue = document
      .getElementById('encrypted-input')
      ?.value?.toLowerCase();

    const error = handleErrorStates(plainValue, encryptedValue);

    if (error) {
      setErrorMessage(error);
      setKey([]);
    } else {
      setKey(processKey(plainValue, encryptedValue));
      setErrorMessage();
    }
  };

  const handleErrorStates = (firstValue, secondValue) => {
    if (!firstValue) return 'Valor original faltando';
    if (!secondValue) return 'Valor encriptado faltando';
    if (firstValue.length != secondValue.length)
      return 'Valores de tamanhos irregulares';
    if (firstValue.length > 5) return 'Valor original é maior do que permitido';
    if (secondValue.length > 5)
      return 'Valor encriptado é maior do que permitido';
    if (invalidInputString(firstValue))
      return 'Valor original possui caracteres invalidos';
    if (invalidInputString(secondValue))
      return 'Valor encriptado possui caracteres invalidos';
  };

  const processKey = (firstValue, secondValue) => {
    let temporaryKey = [];

    for (let i = 0; i < firstValue.length; i++) {
      temporaryKey.push(secondValue.charCodeAt(i) - firstValue.charCodeAt(i));
    }

    return temporaryKey;
  };

  const encryptMessage = () => {
    const message = document
      .getElementById('to-encrypt-input')
      ?.value?.toLowerCase();

    if (invalidInputString(message)) {
      setEncryptedErrorMessage('Mensagem possui caracteres invalidos');
      setEncryptedMessage();
    } else {
      let newMessage = '';

      for (let i = 0; i < message.length; i++) {
        const currentIndex = key[i] ? i : i % key.length;
        newMessage +=
          message[i] === ' '
            ? ' '
            : String.fromCharCode(
                handleOverflowOrUnderFlow(
                  message.charCodeAt(i) + parseInt(key[currentIndex])
                )
              );
      }

      setEncryptedErrorMessage();
      setEncryptedMessage(newMessage);
    }
  };

  const decryptMessage = () => {
    const message = document
      .getElementById('to-decrypt-input')
      ?.value?.toLowerCase();

    if (invalidInputString(message)) {
      setDecryptedErrorMessage('Mensagem possui caracteres invalidos');
      setDecryptedMessage();
    } else {
      let newMessage = '';

      for (let i = 0; i < message.length; i++) {
        const currentIndex = key[i] ? i : i % key.length;
        newMessage +=
          message[i] === ' '
            ? ' '
            : String.fromCharCode(
                handleOverflowOrUnderFlow(
                  message.charCodeAt(i) - parseInt(key[currentIndex])
                )
              );
      }

      setDecryptedErrorMessage();
      setDecryptedMessage(newMessage);
    }
  };

  const invalidInputString = (input) => {
    let invalid = false;

    for (let i = 0; i < input.length; i++) {
      if (invalid) break;
      const currentCharCode = input.charCodeAt(i);

      invalid = currentCharCode < letterA || currentCharCode > letterZ; // Menor que "a" ou maior que "z"
    }

    return invalid;
  };

  const handleOverflowOrUnderFlow = (value) => {
    if (value > letterZ) return value - letterZ + letterA - 1;
    if (value < letterA) return letterZ - (letterA - value) + 1;

    return value;
  };

  return (
    <div class="container">
      <div>
        <div>
          Criptoanálise{' '}
          {keyReady && (
            <span class="crypto-key">(chave: [{key.join(', ')}])</span>
          )}
        </div>
        <div id="cryptoanalysis-set" class="input-set">
          <input id="plain-input" type="text" />
          <input id="encrypted-input" type="text" />
          <button onClick={calcCryptoKey}>Calcular chave</button>
        </div>
        <div class="error-message">{errorMessage}</div>
      </div>
      {keyReady && (
        <>
          <div>
            <div>Encriptação</div>
            <div id="to-encrypt-set" class="input-set">
              <input id="to-encrypt-input" type="text" />
              <button onClick={encryptMessage}>Encriptar</button>
            </div>
            <div class="error-message">{encryptedErrorMessage}</div>
            {encryptedMessage && (
              <span class="encrypted-message">{encryptedMessage}</span>
            )}
          </div>

          <div>
            <div>Decriptação</div>
            <div id="to-decrypt-set" class="input-set">
              <input id="to-decrypt-input" type="text" />
              <button onClick={decryptMessage}>Decriptar</button>
            </div>
            <div class="error-message">{decryptedErrorMessage}</div>
            {decryptedMessage && (
              <span class="decrypted-message">{decryptedMessage}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
