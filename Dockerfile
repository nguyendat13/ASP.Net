# Base image cho .NET runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

# Build app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy file csproj
COPY backend/PhatDat_TH2/PhatDat_TH2.csproj ./PhatDat_TH2/
RUN dotnet restore "./PhatDat_TH2/PhatDat_TH2.csproj"

# copy toàn bộ source code
COPY backend/PhatDat_TH2/. ./PhatDat_TH2/
WORKDIR /src/PhatDat_TH2
RUN dotnet build "PhatDat_TH2.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PhatDat_TH2.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PhatDat_TH2.dll"]
