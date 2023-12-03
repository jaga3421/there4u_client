import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
  Box,
  Divider,
} from "@mui/material";

const TripCard = ({ day, hi }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" component="div">
                {day?.tripDetails?.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Day:{hi + 1}
              </Typography>
            </Box>
            <Typography variant="body1" color="textSecondary" component="div">
              {day?.tripDetails?.summary}
            </Typography>
            <Divider style={{ margin: "8px 0" }} />
            {day?.places?.map((place, placeIndex) => (
              <div key={placeIndex}>
                <Typography variant="subtitle1" component="p">
                  <strong>{place.name}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Time: {place.time}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Description: {place.description}
                </Typography>
              </div>
            ))}
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

const TripDetails = ({ trip }) => {
  return (
    <Box p={4}>
      {trip?.tripDetails?.plan?.length > 0 && (
        <Box textAlign="center">
          <Typography variant="h5" style={{ margin: "16px 0" }}>
            {trip?.tripDetails?.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" component="div">
            {trip?.tripDetails?.summary}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {trip?.tripDetails?.plan?.map((day, index) => (
          <TripCard key={index} day={day} hi={index} />
        ))}
      </Grid>
    </Box>
  );
};

export default TripDetails;
