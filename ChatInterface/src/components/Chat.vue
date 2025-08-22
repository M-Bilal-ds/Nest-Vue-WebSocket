<template>
  <div class="chat-container">  
    <div class="connection-status" :class="{ connected: isConnected, disconnected: !isConnected }">
      {{ isConnected ? 'Connected' : 'Disconnected' }}
    </div>
    
    <div class="messages-container" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message"
        :class="{ sent: message.type === 'sent', received: message.type === 'received' }"
      >
        {{ message.text }}
      </div>
    </div>
    
    <div class="input-container">
      <input 
        v-model="newMessage"
        @keyup.enter="sendMessage"
        class="message-input"
        type="text"
        placeholder="Type a message..."
        :disabled="!isConnected"
      >
      <button 
        @click="sendMessage"
        class="send-button"
        :disabled="!isConnected || !newMessage.trim()"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

const socket = ref(null)
const messages = ref([])
const newMessage = ref('')
const isConnected = ref(false)
const messagesContainer = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const addMessage = (text, type) => {
  messages.value.push({
    id: Date.now(),
    text,
    type
  })
  scrollToBottom()
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !isConnected.value) return

  const message = newMessage.value.trim()
  addMessage(message, 'sent')
  
  socket.value?.emit('messageEvent', message)
  newMessage.value = ''
}

const connectSocket = () => {
  socket.value = io('http://localhost:3000')

  socket.value.on('connect', () => {
    isConnected.value = true
  })

  socket.value.on('disconnect', () => {
    isConnected.value = false
  })

  socket.value.on('reply', (data) => {
    addMessage(data, 'received')
  })

  socket.value.on('connect_error', () => {
    isConnected.value = false
  })
}

onMounted(() => {
  connectSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>