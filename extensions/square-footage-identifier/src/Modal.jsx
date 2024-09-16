import React, { useState } from 'react';
import {
  Text,
  useApi,
  useCartSubscription,
  Screen,
  ScrollView,
  Navigator,
  reactExtension,
  Button,
  FormattedTextField,
  SegmentedControl,
  Stack,
} from '@shopify/ui-extensions-react/point-of-sale';

const Modal = () => {
  const [textFieldValue, setTextFieldValue] = useState('0.00');
  const [selectedSegment, setSelectedSegment] = useState('1');

  
  return (
    <Navigator>
      <Screen name="Donation App" title="Donation App">
        <Stack direction="vertical" paddingHorizontal="ExtraExtraLarge">
          <SegmentedControl
            segments={[
              { id: '1', label: 'Dimensions', disabled: false },
              { id: '2', label: 'Square Footage', disabled: false }
            ]}
            selected={selectedSegment}
            onSelect={setSelectedSegment}
          />
        </Stack>
        <ScrollView>
          <Text variant="headingLarge">Current Cart: {amount}$</Text>
          <Text></Text>
          {selectedSegment === '1' && (
            <>
              <Text>Round to the Nearest</Text>
              <Text>--------------------</Text>
              <Button title="test" onPress={() => roundToNearest(api, cart, '1')} />
              <Text></Text>
              <Button title="test" onPress={() => roundToNearest(api, cart, '5')} />
              <Text></Text>
              <Button title="test" onPress={() => roundToNearest(api, cart, '10')} />
            </>
          )}
          {selectedSegment === '2' && (
            <>
              <Text>Donate An Additional</Text>
              <Text>--------------------</Text>
              <Button title="test1" onPress={() => addAdditionalAmount(api, cart, '1')} />
              <Text></Text>
              <Button title="test2" onPress={() => addAdditionalAmount(api, cart, '3')} />
              <Text></Text>
              <Button title="test3" onPress={() => addAdditionalAmount(api, cart, '5')} />
              <Text></Text>
              <Button title="test4" onPress={() => addAdditionalAmount(api, cart, '10')} />
            </>
          )}
          <Text></Text>
          <Text>---------------------</Text>
        </ScrollView>
      </Screen>
    </Navigator>
  );
};

function roundToNearest(api, cart, nearest) {
  const subTotal = cart.subtotal;
  const roundedAmount = donationNearestAmount(subTotal, nearest);

  if (roundedAmount === '0.00') {
    api.toast.show(`Cart is already rounded to the nearest ${nearest}$`);
    return;
  }

  api.cart.addCustomSale({
    title: 'Donation',
    quantity: 1,
    price: roundedAmount.toString(),
    taxable: false,
  });
  const newAmount = parseFloat(cart.subtotal) + parseFloat(roundedAmount);
  api.toast.show(`Added ${roundedAmount}$ to round to the nearest ${nearest}$ for a total of ${parseFloat(newAmount).toFixed(2)}$`);
  api.navigation.dismiss();
}

function donationNearestAmount(amount, roundTo) {
  const roundedAmount = Math.ceil(amount / roundTo) * roundTo; // Calculate the rounded amount by always rounding up
  const difference = roundedAmount - amount; // Calculate the difference
  return difference.toFixed(2); // Return the difference --> toFixed(2) ensures the result is formatted to 2 decimal places
}

function addAdditionalAmount(api, cart, amount) {
  api.cart.addCustomSale({
    title: 'Donation',
    quantity: 1,
    price: amount,
    taxable: false,
  });
  const newAmount = parseFloat(cart.subtotal) + parseFloat(amount);
  api.toast.show(`Donation of ${amount}$ Added! for a total of ${parseFloat(newAmount).toFixed(2)}$`);
  api.navigation.dismiss();
}

function addCustomAmount(api, cart, customAmount) {
  const amount = customAmount.substring(3);

  if (amount === '0.00' || amount === '0' || amount === '' || isNaN(amount) || amount == 0) {
    api.toast.show(`Please enter a valid donation amount!`);
    return;
  }

  api.cart.addCustomSale({
    title: 'Donation',
    quantity: 1,
    price: amount,
    taxable: false,
  });
  const newAmount = parseFloat(cart.subtotal) + parseFloat(amount);
  api.toast.show(`Donation of ${amount}$ Added! for a total of ${parseFloat(newAmount).toFixed(2)}$`);
  api.navigation.dismiss();
}

export default reactExtension('pos.home.modal.render', () => <Modal />);

/*import React from 'react'
import {useState} from 'react'

import { Text, useApi, useCartSubscription, Screen, ScrollView, Navigator, reactExtension, Button, FormattedTextField, SegmentedControl, Stack } from '@shopify/ui-extensions-react/point-of-sale'

const Modal = () => {

  
  const [textFieldValue, setTextFieldValue] = useState('0.00');
  const [selected, setSelected] = useState('1');

  const api = useApi();
  const cart = useCartSubscription();

  const amount = parseFloat(cart.subtotal).toFixed(2)

  const oneRound = donationNearestAmount(cart.subtotal, '1')
  const oneRoundTotal = (parseFloat(cart.subtotal) + parseFloat(oneRound)).toFixed(2)
  const oneButton = `Nearest $ - ${oneRoundTotal}$ (${oneRound}$)`

  const fiveRound = donationNearestAmount(cart.subtotal, '5')
  const fiveRoundTotal = (parseFloat(cart.subtotal) + parseFloat(fiveRound)).toFixed(2)
  const fiveButton = `Nearest 5$ - ${fiveRoundTotal}$ (${fiveRound}$)`

  const tenRound = donationNearestAmount(cart.subtotal, '10')
  const tenRoundTotal = (parseFloat(cart.subtotal) + parseFloat(tenRound)).toFixed(2)
  const tenButton = `Nearest 10$ - ${tenRoundTotal}$ (${tenRound}$)`
  
  const oneAddTotal = (parseFloat(cart.subtotal) + 1).toFixed(2)
  const oneButtonAdd = `Add 1$ - (${oneAddTotal}$)`
  
  const threeAddTotal = (parseFloat(cart.subtotal) + 3).toFixed(2)
  const threeButtonAdd = `Add 3$ - (${threeAddTotal}$)`
  
  const fiveAddTotal = (parseFloat(cart.subtotal) + 5).toFixed(2)
  const fiveButtonAdd = `Add 5$ - (${fiveAddTotal}$)`
  
  const tenAddTotal = (parseFloat(cart.subtotal) + 10).toFixed(2)
  const tenButtonAdd = `Add 10$ - (${tenAddTotal}$)`
  
  const customDonation = (parseFloat(cart.subtotal) + parseFloat(textFieldValue.substring(3))).toFixed(2)
  const customDonationButton = `${customDonation}$ - (${textFieldValue}$ Donation)`

  return (
    <Navigator>
      <Screen name="Donation App" title="Donation App">
        <Stack direction="vertical" paddingHorizontal="ExtraExtraLarge">
          <SegmentedControl
            segments={[
              { id: '1', label: 'Rounded Donation', disabled: false },
              { id: '2', label: 'Added Donation', disabled: false },
              { id: '3', label: 'Custom Donation', disabled: false },
            ]}
            selected={selectedSegment}
            onSelect={setSelectedSegment}
          />
        </Stack>
        <ScrollView>
          <Text>Current Cart: {amount}</Text>
          <Text></Text>
          {selectedSegment === '1' && (
            <>
              <Text>Round to the Nearest</Text>
              <Text>--------------------</Text>
              <Button title={oneButton} onPress={() => roundToNearest(api, cart, '1')} />
              <Text></Text>
              <Button title={fiveButton} onPress={() => roundToNearest(api, cart, '5')} />
              <Text></Text>
              <Button title={tenButton} onPress={() => roundToNearest(api, cart, '10')} />
            </>
          )}
          {selectedSegment === '2' && (
            <>
              <Text>Donate An Additional</Text>
              <Text>--------------------</Text>
              <Button title={oneButtonAdd} onPress={() => addAdditionalAmount(api, cart, '1')} />
              <Text></Text>
              <Button title={threeButtonAdd} onPress={() => addAdditionalAmount(api, cart, '3')} />
              <Text></Text>
              <Button title={fiveButtonAdd} onPress={() => addAdditionalAmount(api, cart, '5')} />
              <Text></Text>
              <Button title={tenButtonAdd} onPress={() => addAdditionalAmount(api, cart, '10')} />
            </>
          )}
          {selectedSegment === '3' && (
            <>
              <Text>Donate Custom Amount</Text>
              <Text>--------------------</Text>
              <FormattedTextField
                placeholder="Donation Amount"
                inputType="currency"
                onChangeText={setTextFieldValue}
              />
              <Text></Text>
              <Button title={customDonationButton} onPress={() => addCustomAmount(api, cart, textFieldValue)} />
              <Text></Text>
              <Text>---------------------</Text>      
            </>
          )}
        </ScrollView>
      </Screen>
    </Navigator>
  )
}

function roundToNearest(api, cart, nearest) {

  const subTotal = cart.subtotal
  const roundedAmount = donationNearestAmount(subTotal, nearest);

  if(roundedAmount === '0.00'){
    api.toast.show(`Cart is already rounded to the nearest ${nearest}$`)
    return;
  }

  api.cart.addCustomSale({
    title: 'Donation',
    quantity: 1,
    price: roundedAmount.toString(),
    taxable: false
  })
  const newAmount = parseFloat(cart.subtotal) + parseFloat(roundedAmount)
  api.toast.show(`Added ${roundedAmount}$ to round to the nearest ${nearest}$ for a total of ${parseFloat(newAmount).toFixed(2)}$`)
  api.navigation.dismiss()
}

function donationNearestAmount(amount, roundTo) {
  const roundedAmount = Math.ceil(amount / roundTo) * roundTo; // Calculate the rounded amount by always rounding up
  const difference = roundedAmount - amount; // Calculate the difference
  return difference.toFixed(2); // Return the difference --> toFixed(2) ensures the result is formatted to 2 decimal places
}

function addAdditionalAmount(api, cart, amount) {
  api.cart.addCustomSale({
    title: 'Donation',
    quantity: 1,
    price: amount,
    taxable: false
  })
  const newAmount = parseFloat(cart.subtotal) + parseFloat(amount)
  api.toast.show(`Donation of ${amount}$ Added! for a total of ${parseFloat(newAmount).toFixed(2)}$`)
  api.navigation.dismiss()
}

function addCustomAmount(api, cart, customAmount)
{
  amount = customAmount.substring(3)
  
  if(amount == '0.00' || amount == '0'|| amount == '' || isNaN(amount) || amount == 0){
    api.toast.show(`Please enter a valid donation amount!`)
    return;
  }
  
  api.cart.addCustomSale({
    title: 'Donation',
    quantity: 1,
    price: amount,
    taxable: false
  })
  const newAmount = parseFloat(cart.subtotal) + parseFloat(amount)
  api.toast.show(`Donation of ${amount}$ Added! for a total of ${parseFloat(newAmount).toFixed(2)}$`)
  api.navigation.dismiss()
}
export default reactExtension('pos.home.modal.render', () => <Modal />);

/*import React from 'react';
import { reactExtension, Screen, SegmentedControl, Stack } from '@shopify/ui-extensions-react/point-of-sale';

export const SmartGridModal = () => {


  const [selected, setSelected] =
    React.useState('1');
  return (
    <Screen name="SegmentedControl" title="SegmentedControl">
      <Stack direction="vertical" paddingHorizontal="ExtraExtraLarge">
        <SegmentedControl
          segments={[
            { id: '1', label: 'Rounded Donation',disabled: false },
            { id: '2', label: 'Added Donation', disabled: false },
            { id: '3',label: 'Custom Donation', disabled: false }
          ]}
          selected={selected}
          onSelect={setSelected}
        />
      </Stack>
    </Screen>
  );
};

export default reactExtension(
  'pos.home.modal.render',
  () => {
    return <SmartGridModal />;
  },
);


*/