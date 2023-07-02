# Use an official Nginx runtime as the base image
FROM nginx:1.25.1-alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration file from root to nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the static pack from the Next.js build output to the Nginx web root directory
COPY out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]